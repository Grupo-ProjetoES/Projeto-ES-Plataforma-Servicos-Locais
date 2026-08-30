package br.com.ufape.backend.controller;

import br.com.ufape.backend.dto.AtualizarStatusServicoDto;
import br.com.ufape.backend.dto.AvaliacaoRequestDto;
import br.com.ufape.backend.dto.AvaliacaoResponseDto;
import br.com.ufape.backend.dto.ServicoContratadoPrestadorResponseDto;
import br.com.ufape.backend.dto.ServicoContratadoResponseDto;
import br.com.ufape.backend.dto.ServicoDetalheResponseDto;
import br.com.ufape.backend.dto.ServicoRequestDto;
import br.com.ufape.backend.dto.ServicoResumoResponseDto;
import br.com.ufape.backend.model.Servico;
import br.com.ufape.backend.model.User;
import br.com.ufape.backend.service.AvaliacaoService;
import br.com.ufape.backend.service.ServicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicos")
public class ServicoController {

       
    private final ServicoService servicoService;

    private final AvaliacaoService avaliacaoService;

    public ServicoController(ServicoService servicoService, AvaliacaoService avaliacaoService) {
        this.servicoService = servicoService;
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping
    public ResponseEntity<Servico> cadastrar(@RequestBody @Valid ServicoRequestDto dto) {
        Servico servicoSalvo = servicoService.cadastrarServico(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(servicoSalvo);
    }

    // Busca os serviços com base nos filtros fornecidos (categoria, cidade, bairro)
    @GetMapping
    public ResponseEntity<List<ServicoResumoResponseDto>> buscarServicos(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String cidade,
            @RequestParam(required = false) String bairro) {

        List<ServicoResumoResponseDto> resultados = servicoService.buscar(categoria, cidade, bairro);
        return ResponseEntity.ok(resultados);
    }

    // Busca os serviços apenas do prestador autenticado
    @GetMapping("/meus-servicos")
    public ResponseEntity<List<ServicoResumoResponseDto>> listarMeusServicos(
            @AuthenticationPrincipal User usuarioAutenticado) {

        List<ServicoResumoResponseDto> meusServicos = servicoService.buscarPorPrestador(usuarioAutenticado.getId());
        return ResponseEntity.ok(meusServicos);
    }

    @GetMapping("/contratados")
    public ResponseEntity<List<ServicoContratadoResponseDto>> listarServicosContratados(
            @AuthenticationPrincipal User usuarioAutenticado) {

        List<ServicoContratadoResponseDto> servicosContratados =
                servicoService.buscarContratadosPorCliente(usuarioAutenticado.getId());
        return ResponseEntity.ok(servicosContratados);
    }

    // Lista os serviços contratados sob responsabilidade do prestador autenticado que ainda não foram iniciados
    @GetMapping("/contratados/prestador")
    public ResponseEntity<List<ServicoContratadoPrestadorResponseDto>> listarServicosContratadosDoPrestador(
            @AuthenticationPrincipal User usuarioAutenticado) {

        List<ServicoContratadoPrestadorResponseDto> servicos =
                servicoService.buscarContratadosNaoIniciadosPorPrestador(usuarioAutenticado.getId());
        return ResponseEntity.ok(servicos);
    }

    // Busca os detalhes de um serviço específico pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<ServicoDetalheResponseDto> buscarDetalhes(@PathVariable Long id) {
        ServicoDetalheResponseDto detalhe = servicoService.buscarPorId(id);
        return ResponseEntity.ok(detalhe);
    }

    @PostMapping("/{id}/avaliacoes")
    public ResponseEntity<AvaliacaoResponseDto> avaliarServico(
            @PathVariable Long id,
            @AuthenticationPrincipal User usuarioAutenticado,
            @RequestBody @Valid AvaliacaoRequestDto dto) {

        AvaliacaoResponseDto avaliacao = avaliacaoService.criar(id, usuarioAutenticado, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(avaliacao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal User usuarioAutenticado) {

        servicoService.deletarServico(id, usuarioAutenticado.getId());
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarStatusServicoDto dto,
            @AuthenticationPrincipal User usuarioLogado) { // Spring injeta o dono do token aqui
        
        servicoService.atualizarStatus(id, dto.status(), usuarioLogado.getId());
        
        return ResponseEntity.noContent().build(); // Retorna HTTP 204 (Sucesso)
    }
}
