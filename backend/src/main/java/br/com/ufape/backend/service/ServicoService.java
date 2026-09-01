package br.com.ufape.backend.service;

import br.com.ufape.backend.dto.HistoricoServicoContratadoDto;
import br.com.ufape.backend.dto.ServicoContratadoPrestadorResponseDto;
import br.com.ufape.backend.dto.ServicoContratadoResponseDto;
import br.com.ufape.backend.dto.ServicoDetalheResponseDto;
import br.com.ufape.backend.dto.ServicoRequestDto;
import br.com.ufape.backend.dto.ServicoResumoResponseDto;
import br.com.ufape.backend.enums.StatusServico;
import br.com.ufape.backend.model.Orcamento;
import br.com.ufape.backend.model.ProviderProfile;
import br.com.ufape.backend.model.ServiceCategory;
import br.com.ufape.backend.model.Servico;
import br.com.ufape.backend.model.User;
import br.com.ufape.backend.repository.AvaliacaoRepository;
import br.com.ufape.backend.repository.OrcamentoRepository;
import br.com.ufape.backend.repository.ProviderProfileRepository;
import br.com.ufape.backend.repository.ServiceCategoryRepository;
import br.com.ufape.backend.repository.ServicoRepository;
import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final OrcamentoRepository orcamentoRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    public ServicoService(
            ServicoRepository servicoRepository,
            ProviderProfileRepository providerProfileRepository,
            ServiceCategoryRepository categoryRepository,
            OrcamentoRepository orcamentoRepository,
            AvaliacaoRepository avaliacaoRepository) {
        this.servicoRepository = servicoRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.categoryRepository = categoryRepository;
        this.orcamentoRepository = orcamentoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    public Servico cadastrarServico(ServicoRequestDto dto) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        User usuarioLogado = (User) authentication.getPrincipal();

        ProviderProfile prestador = providerProfileRepository.findByUser(usuarioLogado)
                .orElseThrow(() -> new RuntimeException("Perfil de prestador não encontrado para este usuário."));

        ServiceCategory categoria = categoryRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        Servico servico = new Servico();
        servico.setTitulo(dto.titulo());
        servico.setDescricao(dto.descricao());
        servico.setLocalizacao(dto.localizacao());
        servico.setAreaAtendimento(dto.areaAtendimento());
        servico.setFormaCobranca(dto.formaCobranca());
        servico.setCategoria(categoria);
        servico.setPrestador(prestador);
        servico.setStatus(StatusServico.DISPONIVEL);

        return servicoRepository.save(servico);
    }

    public List<ServicoResumoResponseDto> buscar(String categoria, String cidade, String bairro) {
        String categoriaLower = categoria != null ? categoria.toLowerCase() : null;
        String cidadeLike = cidade != null ? "%" + cidade.toLowerCase() + "%" : null;
        String bairroLike = bairro != null ? "%" + bairro.toLowerCase() + "%" : null;
        List<Servico> servicos = servicoRepository.buscarComFiltrosOpcionais(categoriaLower, cidadeLike, bairroLike);

        return servicos.stream().map(s -> new ServicoResumoResponseDto(
                s.getId(),
                s.getTitulo(),
                s.getCategoria().getName(),
                s.getLocalizacao(), 
                s.getAreaAtendimento(), 
                s.getPrestador().getUser().getName()
        )).toList();
    }

    // Busca serviços vinculados ao id do usuário do prestador
    public List<ServicoResumoResponseDto> buscarPorPrestador(Long usuarioId) {
        List<Servico> servicos = servicoRepository.findByPrestadorUserId(usuarioId);

        return servicos.stream().map(s -> new ServicoResumoResponseDto(
                s.getId(),
                s.getTitulo(),
                s.getCategoria().getName(),
                s.getLocalizacao(),
                s.getAreaAtendimento(),
                s.getPrestador().getUser().getName()
        )).toList();
    }

    public List<ServicoContratadoResponseDto> buscarContratadosPorCliente(Long usuarioId) {
        List<Servico> servicos = servicoRepository.findContratadosByClienteId(
                usuarioId,
                List.of(StatusServico.CONTRATADO, StatusServico.EM_ANDAMENTO)
        );

        return servicos.stream().map(s -> new ServicoContratadoResponseDto(
                s.getId(),
                s.getTitulo(),
                s.getCategoria().getName(),
                s.getLocalizacao(),
                s.getAreaAtendimento(),
                s.getPrestador().getUser().getName(),
                s.getStatus()
        )).toList();
    }

    // Busca os serviços contratados sob responsabilidade do prestador que ainda não foram finalizados
    public List<ServicoContratadoPrestadorResponseDto> buscarContratadosNaoIniciadosPorPrestador(Long usuarioId) {
        List<Orcamento> orcamentos = orcamentoRepository.findContratadosNaoIniciadosByPrestadorUserId(
                usuarioId,
                List.of(StatusServico.CONTRATADO, StatusServico.EM_ANDAMENTO)
        );

        return orcamentos.stream().map(o -> {
            Servico servico = o.getServico();
            return new ServicoContratadoPrestadorResponseDto(
                    servico.getId(),
                    servico.getTitulo(),
                    servico.getCategoria().getName(),
                    o.getSolicitante().getName(),
                    o.getLocalAtendimento(),
                    o.getDataOuPeriodoDesejado(),
                    servico.getStatus()
            );
        }).toList();
    }

    public ServicoDetalheResponseDto buscarPorId(Long id) {
        Servico s = servicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));

        return new ServicoDetalheResponseDto(
                s.getId(),
                s.getTitulo(),
                s.getDescricao(),
                s.getCategoria().getName(),
                s.getLocalizacao(),
                s.getAreaAtendimento(),
                s.getFormaCobranca(),
                s.getPrestador().getUser().getName(),
                (s.getPrestador().getPhones() == null || s.getPrestador().getPhones().isEmpty())
                        ? "Não informado" : s.getPrestador().getPhones().get(0),
                s.getPrestador().getDescription()
        );
    }

    @Transactional
     public void deletarServico(Long servicoId, Long usuarioId) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço não encontrado"));
                
        if (!servico.getPrestador().getUser().getId().equals(usuarioId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para excluir este serviço.");
        }

        servicoRepository.delete(servico);
    }
    
    @Transactional
    public void atualizarStatus(Long idServico, StatusServico novoStatus, Long idUsuarioLogado) {
        
        // erro 404
        Servico servico = servicoRepository.findById(idServico)
           .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Serviço com ID " + idServico + " não encontrado."));

        // erro 403 
        if (!servico.getPrestador().getUser().getId().equals(idUsuarioLogado)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para atualizar este serviço.");
        }

        // erro 400
        if (!servico.getStatus().isMudancaValida(novoStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mudança de status não permitida.");
        }

        // salva o novo status
        servico.setStatus(novoStatus);
        servicoRepository.save(servico);
    }

    public List<HistoricoServicoContratadoDto> buscarHistoricoContratacoes(Long clienteId) {
        List<Servico> servicos = servicoRepository.findByClienteId(clienteId);

        List<Long> idsRealizados = servicos.stream()
                .filter(servico -> servico.getStatus() == StatusServico.REALIZADO)
                .map(Servico::getId)
                .toList();

        Set<Long> servicosAvaliados = idsRealizados.isEmpty()
                ? Set.of()
                : new HashSet<>(avaliacaoRepository.findServicoIdsAvaliadosPeloUsuario(clienteId, idsRealizados));

        return servicos.stream().map(servico -> new HistoricoServicoContratadoDto(
                servico.getId(),
                servico.getTitulo(),
                servico.getPrestador().getUser().getName(),
                servico.getDataContratacao(),
                servico.getStatus(),
                servicosAvaliados.contains(servico.getId())
        )).toList();
    }

}
