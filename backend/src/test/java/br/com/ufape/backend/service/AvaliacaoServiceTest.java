package br.com.ufape.backend.service;

import br.com.ufape.backend.dto.AvaliacaoPrestadorEstatisticaDto;
import br.com.ufape.backend.dto.AvaliacaoRequestDto;
import br.com.ufape.backend.dto.AvaliacaoResponseDto;
import br.com.ufape.backend.enums.StatusServico;
import br.com.ufape.backend.exception.AvaliacaoDuplicadaException;
import br.com.ufape.backend.exception.ServicoNaoDisponivelParaAvaliacaoException;
import br.com.ufape.backend.exception.ServicoNotFoundException;
import br.com.ufape.backend.model.Avaliacao;
import br.com.ufape.backend.model.ProviderProfile;
import br.com.ufape.backend.model.Servico;
import br.com.ufape.backend.model.User;
import br.com.ufape.backend.repository.AvaliacaoRepository;
import br.com.ufape.backend.repository.ServicoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AvaliacaoServiceTest {

    @Mock
    private AvaliacaoRepository avaliacaoRepository;

    @Mock
    private ServicoRepository servicoRepository;

    @InjectMocks
    private AvaliacaoService avaliacaoService;

    @Test
    void deveCriarAvaliacaoComSucesso() {
        User usuario = usuario(1L);
        ProviderProfile prestador = prestador(10L);
        Servico servico = servico(100L, usuario, prestador, StatusServico.REALIZADO);
        AvaliacaoRequestDto dto = new AvaliacaoRequestDto(5, "Excelente atendimento");

        when(servicoRepository.findById(100L)).thenReturn(Optional.of(servico));
        when(avaliacaoRepository.existsByServicoIdAndUsuarioId(100L, 1L)).thenReturn(false);
        when(avaliacaoRepository.save(any(Avaliacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AvaliacaoResponseDto response = avaliacaoService.criar(100L, usuario, dto);

        assertNotNull(response);
        assertEquals(100L, response.servicoId());
        assertEquals(10L, response.prestadorId());
        assertEquals(1L, response.usuarioId());
        assertEquals(5, response.nota());
        assertEquals("Excelente atendimento", response.comentario());

        ArgumentCaptor<Avaliacao> captor = ArgumentCaptor.forClass(Avaliacao.class);
        verify(avaliacaoRepository).save(captor.capture());
        assertEquals(servico, captor.getValue().getServico());
        assertEquals(prestador, captor.getValue().getPrestador());
        assertEquals(usuario, captor.getValue().getUsuario());
        assertEquals(5, captor.getValue().getNota());
        assertEquals("Excelente atendimento", captor.getValue().getComentario());
    }

    @Test
    void deveLancarErroQuandoServicoNaoExiste() {
        User usuario = usuario(1L);
        AvaliacaoRequestDto dto = new AvaliacaoRequestDto(5, "Excelente atendimento");

        when(servicoRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(ServicoNotFoundException.class,
                () -> avaliacaoService.criar(100L, usuario, dto));

        verify(avaliacaoRepository, never()).save(any(Avaliacao.class));
    }

    @Test
    void deveLancarErroQuandoServicoNaoPertenceAoUsuario() {
        User usuarioAutenticado = usuario(1L);
        User outroUsuario = usuario(2L);
        ProviderProfile prestador = prestador(10L);
        Servico servico = servico(100L, outroUsuario, prestador, StatusServico.REALIZADO);
        AvaliacaoRequestDto dto = new AvaliacaoRequestDto(4, "Bom atendimento");

        when(servicoRepository.findById(100L)).thenReturn(Optional.of(servico));

        assertThrows(ServicoNaoDisponivelParaAvaliacaoException.class,
                () -> avaliacaoService.criar(100L, usuarioAutenticado, dto));

        verify(avaliacaoRepository, never()).save(any(Avaliacao.class));
    }

    @Test
    void deveLancarErroQuandoServicoNaoFoiRealizado() {
        User usuario = usuario(1L);
        ProviderProfile prestador = prestador(10L);
        Servico servico = servico(100L, usuario, prestador, StatusServico.EM_ANDAMENTO);
        AvaliacaoRequestDto dto = new AvaliacaoRequestDto(4, "Bom atendimento");

        when(servicoRepository.findById(100L)).thenReturn(Optional.of(servico));

        assertThrows(ServicoNaoDisponivelParaAvaliacaoException.class,
                () -> avaliacaoService.criar(100L, usuario, dto));

        verify(avaliacaoRepository, never()).save(any(Avaliacao.class));
    }

    @Test
    void deveLancarErroQuandoAvaliacaoJaExiste() {
        User usuario = usuario(1L);
        ProviderProfile prestador = prestador(10L);
        Servico servico = servico(100L, usuario, prestador, StatusServico.REALIZADO);
        AvaliacaoRequestDto dto = new AvaliacaoRequestDto(3, "Atendimento regular");

        when(servicoRepository.findById(100L)).thenReturn(Optional.of(servico));
        when(avaliacaoRepository.existsByServicoIdAndUsuarioId(100L, 1L)).thenReturn(true);

        assertThrows(AvaliacaoDuplicadaException.class,
                () -> avaliacaoService.criar(100L, usuario, dto));

        verify(avaliacaoRepository, never()).save(any(Avaliacao.class));
    }

    @Test
    void deveRetornarEstatisticasQuandoPrestadorPossuiAvaliacoes() {
        Long prestadorId = 10L;
        when(avaliacaoRepository.calcularMediaNotasPorPrestadorId(prestadorId)).thenReturn(4.5);
        when(avaliacaoRepository.contarPorPrestadorId(prestadorId)).thenReturn(8L);

        AvaliacaoPrestadorEstatisticaDto estatisticas = avaliacaoService.obterEstatisticasPrestador(prestadorId);

        assertNotNull(estatisticas);
        assertEquals(4.5, estatisticas.notaMedia());
        assertEquals(8L, estatisticas.totalAvaliacoes());
    }

    @Test
    void deveRetornarEstatisticasComNotaNulaETotalZeroQuandoPrestadorNaoPossuiAvaliacoes() {
        Long prestadorId = 20L;
        when(avaliacaoRepository.calcularMediaNotasPorPrestadorId(prestadorId)).thenReturn(null);
        when(avaliacaoRepository.contarPorPrestadorId(prestadorId)).thenReturn(0L);

        AvaliacaoPrestadorEstatisticaDto estatisticas = avaliacaoService.obterEstatisticasPrestador(prestadorId);

        assertNotNull(estatisticas);
        assertNull(estatisticas.notaMedia());
        assertEquals(0L, estatisticas.totalAvaliacoes());
    }

    @Test
    void deveRetornarEstatisticasComNotaNulaETotalZeroQuandoPrestadorIdForNulo() {
        AvaliacaoPrestadorEstatisticaDto estatisticas = avaliacaoService.obterEstatisticasPrestador(null);

        assertNotNull(estatisticas);
        assertNull(estatisticas.notaMedia());
        assertEquals(0L, estatisticas.totalAvaliacoes());
    }

    private User usuario(Long id) {
        User user = new User();
        user.setId(id);
        user.setEmail("usuario" + id + "@teste.com");
        return user;
    }

    private ProviderProfile prestador(Long id) {
        ProviderProfile prestador = new ProviderProfile();
        ReflectionTestUtils.setField(prestador, "id", id);
        return prestador;
    }

    private Servico servico(Long id, User cliente, ProviderProfile prestador, StatusServico status) {
        Servico servico = new Servico();
        ReflectionTestUtils.setField(servico, "id", id);
        servico.setCliente(cliente);
        servico.setPrestador(prestador);
        servico.setStatus(status);
        return servico;
    }
}
