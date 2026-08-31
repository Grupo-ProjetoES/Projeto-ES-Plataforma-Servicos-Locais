package br.com.ufape.backend.service;

import br.com.ufape.backend.dto.OrcamentoRequestDto;
import br.com.ufape.backend.dto.OrcamentoResponderRequestDto;
import br.com.ufape.backend.dto.OrcamentoResponseDto;
import br.com.ufape.backend.enums.StatusServico;
import br.com.ufape.backend.model.*;
import br.com.ufape.backend.repository.OrcamentoRepository;
import br.com.ufape.backend.repository.ServicoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrcamentoServiceTest {

    @Mock
    private OrcamentoRepository orcamentoRepository;

    @Mock
    private ServicoRepository servicoRepository;

    @InjectMocks
    private OrcamentoService orcamentoService;

    private User solicitante;
    private ProviderProfile prestador;
    private Servico servico;

    private void configurarServicoValido() {
        User usuarioPrestador = new User();
        usuarioPrestador.setName("Rafael Prestador");

        prestador = new ProviderProfile();
        prestador.setUser(usuarioPrestador);
        ReflectionTestUtils.setField(prestador, "id", 5L);

        servico = new Servico();
        ReflectionTestUtils.setField(servico, "id", 10L);
        servico.setTitulo("Instalação Elétrica");
        servico.setPrestador(prestador);

        solicitante = new User();
        solicitante.setName("Cliente Teste");
        solicitante.setEmail("cliente@teste.com");
    }

    @Test
    void deveSolicitarOrcamentoComSucesso() {
        configurarServicoValido();

        OrcamentoRequestDto dto = new OrcamentoRequestDto(
                10L,
                "Preciso trocar o quadro elétrico",
                "Rua das Flores, 123",
                "Próxima semana"
        );
        

        when(servicoRepository.findById(10L)).thenReturn(Optional.of(servico));
        when(orcamentoRepository.save(any(Orcamento.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrcamentoResponseDto resultado = orcamentoService.solicitar(solicitante, dto);

        assertNotNull(resultado);
        assertEquals("Preciso trocar o quadro elétrico", resultado.descricaoNecessidade());
        assertEquals("Rua das Flores, 123", resultado.localAtendimento());
        assertEquals("Próxima semana", resultado.dataOuPeriodoDesejado());
        assertEquals(10L, resultado.servicoId());
        assertEquals("Instalação Elétrica", resultado.tituloServico());
        assertEquals("Rafael Prestador", resultado.nomePrestador());
        assertEquals("Cliente Teste", resultado.nomeSolicitante());
        assertEquals("cliente@teste.com", resultado.emailSolicitante());

        ArgumentCaptor<Orcamento> captor = ArgumentCaptor.forClass(Orcamento.class);
        verify(orcamentoRepository).save(captor.capture());
        assertEquals(servico, captor.getValue().getServico());
        assertEquals(prestador, captor.getValue().getPrestador());
        assertEquals(solicitante, captor.getValue().getSolicitante());
    }

    @Test
    void deveLancarErro404QuandoServicoNaoExistir() {
        User usuario = new User();
        OrcamentoRequestDto dto = new OrcamentoRequestDto(
                99L,
                "Descrição",
                "Local",
                "Amanhã"
        );

        when(servicoRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.solicitar(usuario, dto)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void deveLancarErro404QuandoPrestadorDoServicoNaoExistir() {
        User usuario = new User();
        servico = new Servico();
        ReflectionTestUtils.setField(servico, "id", 10L);
        servico.setTitulo("Instalação Elétrica");

        OrcamentoRequestDto dto = new OrcamentoRequestDto(10L, "Descrição", "Local", "Amanhã");

        when(servicoRepository.findById(10L)).thenReturn(Optional.of(servico));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.solicitar(usuario, dto)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Prestador não encontrado", exception.getReason());
    }

    @Test
    void deveListarOrcamentosRecebidosPeloPrestador() {
        configurarServicoValido();

        Orcamento orcamento = new Orcamento();
        ReflectionTestUtils.setField(orcamento, "id", 1L);
        orcamento.setDescricaoNecessidade("Descrição");
        orcamento.setLocalAtendimento("Local");
        orcamento.setDataOuPeriodoDesejado("Amanhã");
        orcamento.setServico(servico);
        orcamento.setPrestador(prestador);
        orcamento.setSolicitante(solicitante);

        when(orcamentoRepository.findByPrestadorUserId(7L)).thenReturn(List.of(orcamento));

        List<OrcamentoResponseDto> resultado = orcamentoService.buscarRecebidosPorPrestador(7L);

        assertEquals(1, resultado.size());
        assertEquals("Cliente Teste", resultado.get(0).nomeSolicitante());
    }

    @Test
    void deveResponderOrcamentoComSucesso() {
        configurarServicoValido(); 
        
        User prestadorAutenticado = prestador.getUser();
        ReflectionTestUtils.setField(prestadorAutenticado, "id", 7L); 

        Orcamento orcamentoNoBanco = new Orcamento();
        ReflectionTestUtils.setField(orcamentoNoBanco, "id", 1L);
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);
        orcamentoNoBanco.setStatusResposta("PENDENTE");

        OrcamentoResponderRequestDto dto = new OrcamentoResponderRequestDto(
                new BigDecimal("500.00"), 
                "Consigo fazer o serviço na quinta-feira"
        );

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));
        when(orcamentoRepository.save(any(Orcamento.class))).thenAnswer(i -> i.getArgument(0));

        OrcamentoResponseDto resultado = orcamentoService.responder(1L, prestadorAutenticado, dto);

        assertNotNull(resultado);
        assertEquals("RESPONDIDO", resultado.statusResposta());
        assertEquals(new BigDecimal("500.00"), resultado.valorResposta());
        assertEquals("Consigo fazer o serviço na quinta-feira", resultado.descricaoResposta());
    }

    @Test
    void deveLancarErro404AoResponderQuandoOrcamentoNaoExistir() {
        User prestadorAutenticado = new User();
        prestadorAutenticado.setId(7L);
        OrcamentoResponderRequestDto dto = new OrcamentoResponderRequestDto(new BigDecimal("500.00"), "Resposta");

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.responder(1L, prestadorAutenticado, dto)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void deveLancarErro403AoResponderQuandoUsuarioNaoForODono() {
        configurarServicoValido();
        User prestadorAutenticado = new User();
        prestadorAutenticado.setId(9L);
        OrcamentoResponderRequestDto dto = new OrcamentoResponderRequestDto(new BigDecimal("500.00"), "Resposta");
        ReflectionTestUtils.setField(prestador.getUser(), "id", 7L);

        Orcamento orcamentoNoBanco = new Orcamento();
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.responder(1L, prestadorAutenticado, dto)
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void deveLancarErro400AoResponderQuandoOrcamentoJaFoiRespondido() {
        configurarServicoValido();
        User prestadorAutenticado = prestador.getUser();
        ReflectionTestUtils.setField(prestadorAutenticado, "id", 7L);
        OrcamentoResponderRequestDto dto = new OrcamentoResponderRequestDto(new BigDecimal("500.00"), "Resposta");

        Orcamento orcamentoNoBanco = new Orcamento();
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);
        orcamentoNoBanco.setStatusResposta("RESPONDIDO");

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.responder(1L, prestadorAutenticado, dto)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deveAceitarOrcamentoEVincularClienteAoServico() {
        configurarServicoValido();
        ReflectionTestUtils.setField(solicitante, "id", 20L);
        servico.setStatus(StatusServico.DISPONIVEL);

        Orcamento orcamentoNoBanco = new Orcamento();
        ReflectionTestUtils.setField(orcamentoNoBanco, "id", 1L);
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);
        orcamentoNoBanco.setStatusResposta("RESPONDIDO");

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));
        when(orcamentoRepository.save(any(Orcamento.class))).thenAnswer(i -> i.getArgument(0));

        OrcamentoResponseDto resultado = orcamentoService.aceitar(1L, solicitante);

        assertNotNull(resultado);
        assertEquals("ACEITO", resultado.statusResposta());
        assertEquals(solicitante, servico.getCliente());
        assertEquals(StatusServico.CONTRATADO, servico.getStatus());
        assertNotNull(servico.getDataContratacao());
    }

    @Test
    void deveLancarErro403QuandoOutroUsuarioTentaAceitarOrcamento() {
        configurarServicoValido();
        ReflectionTestUtils.setField(solicitante, "id", 20L);
        servico.setStatus(StatusServico.DISPONIVEL);

        Orcamento orcamentoNoBanco = new Orcamento();
        ReflectionTestUtils.setField(orcamentoNoBanco, "id", 1L);
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);
        orcamentoNoBanco.setStatusResposta("RESPONDIDO");

        User outroUsuario = new User();
        ReflectionTestUtils.setField(outroUsuario, "id", 99L);

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.aceitar(1L, outroUsuario)
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void deveLancarErro404QuandoOrcamentoNaoExistirAoAceitar() {
        User usuario = new User();
        when(orcamentoRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.aceitar(1L, usuario)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void deveLancarErro400QuandoOrcamentoNaoFoiRespondido() {
        configurarServicoValido();
        ReflectionTestUtils.setField(solicitante, "id", 20L);
        servico.setStatus(StatusServico.DISPONIVEL);

        Orcamento orcamentoNoBanco = new Orcamento();
        ReflectionTestUtils.setField(orcamentoNoBanco, "id", 1L);
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);
        orcamentoNoBanco.setStatusResposta("PENDENTE");

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.aceitar(1L, solicitante)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deveLancarErro400QuandoServicoJaEstiverContratado() {
        configurarServicoValido();
        ReflectionTestUtils.setField(solicitante, "id", 20L);
        servico.setStatus(StatusServico.CONTRATADO);

        Orcamento orcamentoNoBanco = new Orcamento();
        ReflectionTestUtils.setField(orcamentoNoBanco, "id", 1L);
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);
        orcamentoNoBanco.setStatusResposta("RESPONDIDO");

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.aceitar(1L, solicitante)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deveRecusarOrcamentoComSucesso() {
        configurarServicoValido();
        ReflectionTestUtils.setField(solicitante, "id", 20L);

        Orcamento orcamentoNoBanco = new Orcamento();
        ReflectionTestUtils.setField(orcamentoNoBanco, "id", 1L);
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);
        orcamentoNoBanco.setStatusResposta("RESPONDIDO");

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));
        when(orcamentoRepository.save(any(Orcamento.class))).thenAnswer(i -> i.getArgument(0));

        OrcamentoResponseDto resultado = orcamentoService.recusar(1L, solicitante);

        assertEquals("RECUSADO", resultado.statusResposta());
        verify(orcamentoRepository).save(orcamentoNoBanco);
    }

    @Test
    void deveLancarErro404AoRecusarQuandoOrcamentoNaoExistir() {
        User usuario = new User();
        when(orcamentoRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.recusar(1L, usuario)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void deveLancarErro403AoRecusarQuandoNaoForOSolicitante() {
        configurarServicoValido();
        ReflectionTestUtils.setField(solicitante, "id", 20L);

        User outroUsuario = new User();
        outroUsuario.setId(99L);

        Orcamento orcamentoNoBanco = new Orcamento();
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);
        orcamentoNoBanco.setStatusResposta("RESPONDIDO");

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.recusar(1L, outroUsuario)
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void deveLancarErro400AoRecusarQuandoOrcamentoNaoFoiRespondido() {
        configurarServicoValido();
        ReflectionTestUtils.setField(solicitante, "id", 20L);

        Orcamento orcamentoNoBanco = new Orcamento();
        orcamentoNoBanco.setPrestador(prestador);
        orcamentoNoBanco.setSolicitante(solicitante);
        orcamentoNoBanco.setServico(servico);
        orcamentoNoBanco.setStatusResposta("PENDENTE");

        when(orcamentoRepository.findById(1L)).thenReturn(Optional.of(orcamentoNoBanco));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orcamentoService.recusar(1L, solicitante)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deveListarOrcamentosSolicitadosPorCliente() {
        configurarServicoValido();

        Orcamento orcamento = new Orcamento();
        ReflectionTestUtils.setField(orcamento, "id", 2L);
        orcamento.setDescricaoNecessidade("Pintura");
        orcamento.setLocalAtendimento("Boa Viagem");
        orcamento.setDataOuPeriodoDesejado("Segunda");
        orcamento.setServico(servico);
        orcamento.setPrestador(prestador);
        orcamento.setSolicitante(solicitante);

        when(orcamentoRepository.findBySolicitanteId(20L)).thenReturn(List.of(orcamento));

        List<OrcamentoResponseDto> resultado = orcamentoService.buscarSolicitadosPorCliente(20L);

        assertEquals(1, resultado.size());
        assertEquals("Cliente Teste", resultado.get(0).nomeSolicitante());
        assertEquals("Rafael Prestador", resultado.get(0).nomePrestador());
    }
}
