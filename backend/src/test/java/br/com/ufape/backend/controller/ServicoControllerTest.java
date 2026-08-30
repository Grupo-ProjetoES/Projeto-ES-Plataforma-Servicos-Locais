package br.com.ufape.backend.controller;

import br.com.ufape.backend.dto.AvaliacaoRequestDto;
import br.com.ufape.backend.dto.AvaliacaoResponseDto;
import br.com.ufape.backend.dto.ServicoContratadoPrestadorResponseDto;
import br.com.ufape.backend.dto.ServicoContratadoResponseDto;
import br.com.ufape.backend.enums.StatusServico;
import br.com.ufape.backend.enums.UserRole;
import br.com.ufape.backend.exception.AvaliacaoDuplicadaException;
import br.com.ufape.backend.exception.ServicoNaoDisponivelParaAvaliacaoException;
import br.com.ufape.backend.exception.ServicoNotFoundException;
import br.com.ufape.backend.model.User;
import br.com.ufape.backend.repository.UserRepository;
import br.com.ufape.backend.service.AvaliacaoService;
import br.com.ufape.backend.service.ServicoService;
import br.com.ufape.backend.service.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ServicoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ServicoService servicoService;

    @MockitoBean
    private AvaliacaoService avaliacaoService;

    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private UserRepository userRepository;

    private User usuarioAutenticado;

    @BeforeEach
    void setUp() {
        usuarioAutenticado = new User();
        usuarioAutenticado.setId(1L);
        usuarioAutenticado.setName("Ana");
        usuarioAutenticado.setEmail("ana@email.com");
        usuarioAutenticado.setRole(UserRole.USER);
        usuarioAutenticado.setPassword("senha123");
    }

    @Test
    void deveRetornar401QuandoUsuarioNaoEstaAutenticado() throws Exception {
        mockMvc.perform(post("/api/servicos/1/avaliacoes")
                        .contextPath("/api")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AvaliacaoRequestDto(5, "Excelente"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void deveRetornar401QuandoUsuarioNaoEstaAutenticadoAoListarServicosContratados() throws Exception {
        mockMvc.perform(get("/api/servicos/contratados")
                        .contextPath("/api"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void devePermitirListarServicosContratadosParaUsuarioAutenticadoComOutraRole() throws Exception {
        User prestadorAutenticado = criarUsuarioAutenticado(2L, "Carlos", "carlos@email.com", UserRole.PRESTADOR);
        when(servicoService.buscarContratadosPorCliente(prestadorAutenticado.getId())).thenReturn(List.of());

        mockMvc.perform(get("/api/servicos/contratados")
                        .contextPath("/api")
                        .with(authentication(prestadorAutenticado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void deveRetornarServicosContratadosQuandoUsuarioAutenticadoPossuirServicos() throws Exception {
        List<ServicoContratadoResponseDto> response = List.of(
                new ServicoContratadoResponseDto(
                        1L,
                        "Instalação Elétrica",
                        "Eletricista",
                        "Boa Viagem",
                        "Recife",
                        "Carlos Prestador",
                        StatusServico.CONTRATADO
                ),
                new ServicoContratadoResponseDto(
                        2L,
                        "Pintura Residencial",
                        "Pintor",
                        "Casa Amarela",
                        "Recife",
                        "Marcos Pintor",
                        StatusServico.EM_ANDAMENTO
                )
        );

        when(servicoService.buscarContratadosPorCliente(usuarioAutenticado.getId())).thenReturn(response);

        mockMvc.perform(get("/api/servicos/contratados")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].titulo").value("Instalação Elétrica"))
                .andExpect(jsonPath("$[0].categoria").value("Eletricista"))
                .andExpect(jsonPath("$[0].bairro").value("Boa Viagem"))
                .andExpect(jsonPath("$[0].cidade").value("Recife"))
                .andExpect(jsonPath("$[0].nomePrestador").value("Carlos Prestador"))
                .andExpect(jsonPath("$[0].statusAtual").value("CONTRATADO"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].statusAtual").value("EM_ANDAMENTO"));
    }

    @Test
    void deveRetornarListaVaziaQuandoUsuarioAutenticadoNaoPossuirServicosContratados() throws Exception {
        when(servicoService.buscarContratadosPorCliente(anyLong())).thenReturn(List.of());

        mockMvc.perform(get("/api/servicos/contratados")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void deveRetornar401AoListarContratadosDoPrestadorQuandoUsuarioNaoEstaAutenticado() throws Exception {
        mockMvc.perform(get("/api/servicos/contratados/prestador")
                        .contextPath("/api"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void deveRetornar403AoListarContratadosDoPrestadorQuandoUsuarioNaoForPrestador() throws Exception {
        mockMvc.perform(get("/api/servicos/contratados/prestador")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isForbidden());
    }

    @Test
    void deveListarContratadosDoPrestadorQuandoPrestadorPossuirServicosNaoIniciados() throws Exception {
        User prestadorAutenticado = criarUsuarioAutenticado(2L, "Carlos", "carlos@email.com", UserRole.PRESTADOR);
        List<ServicoContratadoPrestadorResponseDto> response = List.of(
                new ServicoContratadoPrestadorResponseDto(
                        1L,
                        "Instalação Elétrica",
                        "Eletricista",
                        "Ana Contratante",
                        "Boa Viagem, Recife",
                        "Próxima segunda de manhã",
                        StatusServico.CONTRATADO
                )
        );

        when(servicoService.buscarContratadosNaoIniciadosPorPrestador(prestadorAutenticado.getId()))
                .thenReturn(response);

        mockMvc.perform(get("/api/servicos/contratados/prestador")
                        .contextPath("/api")
                        .with(authentication(prestadorAutenticado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].titulo").value("Instalação Elétrica"))
                .andExpect(jsonPath("$[0].categoria").value("Eletricista"))
                .andExpect(jsonPath("$[0].nomeContratante").value("Ana Contratante"))
                .andExpect(jsonPath("$[0].localAtendimento").value("Boa Viagem, Recife"))
                .andExpect(jsonPath("$[0].dataOuPeriodoSolicitado").value("Próxima segunda de manhã"))
                .andExpect(jsonPath("$[0].statusAtual").value("CONTRATADO"));
    }

    @Test
    void deveRetornarListaVaziaQuandoPrestadorNaoPossuirContratadosNaoIniciados() throws Exception {
        User prestadorAutenticado = criarUsuarioAutenticado(2L, "Carlos", "carlos@email.com", UserRole.PRESTADOR);
        when(servicoService.buscarContratadosNaoIniciadosPorPrestador(anyLong())).thenReturn(List.of());

        mockMvc.perform(get("/api/servicos/contratados/prestador")
                        .contextPath("/api")
                        .with(authentication(prestadorAutenticado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void deveCriarAvaliacaoQuandoRequisicaoForValida() throws Exception {
        AvaliacaoResponseDto response = new AvaliacaoResponseDto(
                1L,
                1L,
                10L,
                1L,
                5,
                "Excelente atendimento",
                LocalDateTime.of(2026, 8, 20, 10, 0)
        );

        when(avaliacaoService.criar(
                1L,
                usuarioAutenticado,
                new AvaliacaoRequestDto(5, "Excelente atendimento")
        )).thenReturn(response);

        mockMvc.perform(post("/api/servicos/1/avaliacoes")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AvaliacaoRequestDto(5, "Excelente atendimento"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.servicoId").value(1))
                .andExpect(jsonPath("$.prestadorId").value(10))
                .andExpect(jsonPath("$.usuarioId").value(1))
                .andExpect(jsonPath("$.nota").value(5))
                .andExpect(jsonPath("$.comentario").value("Excelente atendimento"));
    }

    @Test
    void deveRetornar400QuandoNotaNaoForInformada() throws Exception {
        mockMvc.perform(post("/api/servicos/1/avaliacoes")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"comentario\":\"Excelente atendimento\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("nota: A nota é obrigatória"));
    }

    @Test
    void deveRetornar404QuandoServicoNaoExistir() throws Exception {
        when(avaliacaoService.criar(
                999L,
                usuarioAutenticado,
                new AvaliacaoRequestDto(5, "Excelente atendimento")
        ))
                .thenThrow(new ServicoNotFoundException());

        mockMvc.perform(post("/api/servicos/999/avaliacoes")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AvaliacaoRequestDto(5, "Excelente atendimento"))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Serviço não encontrado"));
    }

    @Test
    void deveRetornar403QuandoServicoNaoPuderSerAvaliado() throws Exception {
        when(avaliacaoService.criar(
                1L,
                usuarioAutenticado,
                new AvaliacaoRequestDto(5, "Excelente atendimento")
        ))
                .thenThrow(new ServicoNaoDisponivelParaAvaliacaoException());

        mockMvc.perform(post("/api/servicos/1/avaliacoes")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AvaliacaoRequestDto(5, "Excelente atendimento"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message")
                        .value("O serviço informado não pertence ao usuário ou ainda não foi realizado"));
    }

    @Test
    void deveRetornar409QuandoAvaliacaoForDuplicada() throws Exception {
        when(avaliacaoService.criar(
                1L,
                usuarioAutenticado,
                new AvaliacaoRequestDto(5, "Excelente atendimento")
        ))
                .thenThrow(new AvaliacaoDuplicadaException());

        mockMvc.perform(post("/api/servicos/1/avaliacoes")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AvaliacaoRequestDto(5, "Excelente atendimento"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("O usuário já avaliou este serviço"));
    }

    private User criarUsuarioAutenticado(Long id, String nome, String email, UserRole role) {
        User usuario = new User();
        usuario.setId(id);
        usuario.setName(nome);
        usuario.setEmail(email);
        usuario.setRole(role);
        usuario.setPassword("senha123");
        return usuario;
    }

    private RequestPostProcessor authentication(User usuario) {
        return SecurityMockMvcRequestPostProcessors.authentication(
                new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities())
        );
    }
}
