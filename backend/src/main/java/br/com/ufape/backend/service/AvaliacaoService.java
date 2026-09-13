package br.com.ufape.backend.service;

import br.com.ufape.backend.dto.AvaliacaoPrestadorEstatisticaDto;
import br.com.ufape.backend.dto.AvaliacaoRequestDto;
import br.com.ufape.backend.dto.AvaliacaoResponseDto;
import br.com.ufape.backend.enums.StatusServico;
import br.com.ufape.backend.exception.AvaliacaoDuplicadaException;
import br.com.ufape.backend.exception.ServicoNaoDisponivelParaAvaliacaoException;
import br.com.ufape.backend.exception.ServicoNotFoundException;
import br.com.ufape.backend.model.Avaliacao;
import br.com.ufape.backend.model.Servico;
import br.com.ufape.backend.model.User;
import br.com.ufape.backend.repository.AvaliacaoRepository;
import br.com.ufape.backend.repository.ServicoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final ServicoRepository servicoRepository;

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository, ServicoRepository servicoRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.servicoRepository = servicoRepository;
    }

    @Transactional
    public AvaliacaoResponseDto criar(Long servicoId, User usuarioAutenticado, AvaliacaoRequestDto dto) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(ServicoNotFoundException::new);

        if (!servicoDisponivelParaAvaliacao(servico, usuarioAutenticado)) {
            throw new ServicoNaoDisponivelParaAvaliacaoException();
        }

        if (avaliacaoRepository.existsByServicoIdAndUsuarioId(servicoId, usuarioAutenticado.getId())) {
            throw new AvaliacaoDuplicadaException();
        }

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setServico(servico);
        avaliacao.setPrestador(servico.getPrestador());
        avaliacao.setUsuario(usuarioAutenticado);
        avaliacao.setNota(dto.nota());
        avaliacao.setComentario(dto.comentario());

        Avaliacao avaliacaoSalva = avaliacaoRepository.save(avaliacao);
        return AvaliacaoResponseDto.from(avaliacaoSalva);
    }

    private boolean servicoDisponivelParaAvaliacao(Servico servico, User usuarioAutenticado) {
        return servico.getCliente() != null
                && servico.getCliente().getId() != null
                && servico.getCliente().getId().equals(usuarioAutenticado.getId())
                && servico.getStatus() == StatusServico.REALIZADO;
    }

    @Transactional(readOnly = true)
    public AvaliacaoPrestadorEstatisticaDto obterEstatisticasPrestador(Long prestadorId) {
        if (prestadorId == null) {
            return new AvaliacaoPrestadorEstatisticaDto(null, 0L);
        }

        Double media = avaliacaoRepository.calcularMediaNotasPorPrestadorId(prestadorId);
        Long total = avaliacaoRepository.contarPorPrestadorId(prestadorId);

        return new AvaliacaoPrestadorEstatisticaDto(
                media,
                total != null ? total : 0L
        );
    }
}
