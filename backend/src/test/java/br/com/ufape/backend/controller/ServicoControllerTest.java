package br.com.ufape.backend.controller;

import br.com.ufape.backend.dto.AvaliacaoRequestDto;
import br.com.ufape.backend.dto.AvaliacaoResponseDto;
import br.com.ufape.backend.dto.ServicoComparacaoResponseDto;
import br.com.ufape.backend.dto.ServicoContratadoPrestadorResponseDto;
import br.com.ufape.backend.dto.ServicoContratadoResponseDto;
import br.com.ufape.backend.enums.FormaCobranca;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.server.ResponseStatusException;
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

    @Test
    void deveRetornarHistoricoComSucesso() throws Exception {
        when(servicoService.buscarHistoricoContratacoes(usuarioAutenticado.getId()))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/servicos/contratados/historico")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void deveRetornar401AoBuscarHistoricoSemEstarLogado() throws Exception {
        mockMvc.perform(get("/api/servicos/contratados/historico")
                        .contextPath("/api"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void deveRetornar200EListaComparacaoAoPassarDoisServicosValidos() throws Exception {
        List<ServicoComparacaoResponseDto> response = List.of(
                new ServicoComparacaoResponseDto(
                        1L, "Instalação Elétrica", "Eletricista", "Boa Viagem", "Recife",
                        FormaCobranca.POR_HORA, "Carlos Prestador", 4.8, 15L
                ),
                new ServicoComparacaoResponseDto(
                        2L, "Pintura Residencial", "Pintor", "Piedade", "Jaboatão",
                        FormaCobranca.VALOR_FIXO_TOTAL, "Maria Prestadora", 4.5, 8L
                )
        );

        when(servicoService.compararServicos(List.of(1L, 2L))).thenReturn(response);

        mockMvc.perform(get("/api/servicos/comparar")
                        .contextPath("/api")
                        .param("ids", "1,2")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].titulo").value("Instalação Elétrica"))
                .andExpect(jsonPath("$[0].categoria").value("Eletricista"))
                .andExpect(jsonPath("$[0].bairro").value("Boa Viagem"))
                .andExpect(jsonPath("$[0].cidade").value("Recife"))
                .andExpect(jsonPath("$[0].formaCobranca").value("POR_HORA"))
                .andExpect(jsonPath("$[0].nomePrestador").value("Carlos Prestador"))
                .andExpect(jsonPath("$[0].notaMediaPrestador").value(4.8))
                .andExpect(jsonPath("$[0].totalAvaliacoesPrestador").value(15))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].notaMediaPrestador").value(4.5));
    }

    @Test
    void deveRetornar200EListaComparacaoAoPassarTresServicosValidos() throws Exception {
        List<ServicoComparacaoResponseDto> response = List.of(
                new ServicoComparacaoResponseDto(1L, "S1", "C1", "B1", "C1", FormaCobranca.POR_HORA, "P1", 5.0, 1L),
                new ServicoComparacaoResponseDto(2L, "S2", "C2", "B2", "C2", FormaCobranca.DIARIA, "P2", null, 0L),
                new ServicoComparacaoResponseDto(3L, "S3", "C3", "B3", "C3", FormaCobranca.MENSALIDADE, "P3", 4.0, 3L)
        );

        when(servicoService.compararServicos(List.of(1L, 2L, 3L))).thenReturn(response);

        mockMvc.perform(get("/api/servicos/comparar")
                        .contextPath("/api")
                        .param("ids", "1,2,3")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].totalAvaliacoesPrestador").value(0));
    }

    @Test
    void deveRetornar400QuandoPassarMenosDeDoisIds() throws Exception {
        when(servicoService.compararServicos(List.of(1L)))
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "A comparação deve ser feita entre 2 e 3 serviços."));

        mockMvc.perform(get("/api/servicos/comparar")
                        .contextPath("/api")
                        .param("ids", "1")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("A comparação deve ser feita entre 2 e 3 serviços."));
    }

    @Test
    void deveRetornar400QuandoPassarMaisDeTresIds() throws Exception {
        when(servicoService.compararServicos(List.of(1L, 2L, 3L, 4L)))
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "A comparação deve ser feita entre 2 e 3 serviços."));

        mockMvc.perform(get("/api/servicos/comparar")
                        .contextPath("/api")
                        .param("ids", "1,2,3,4")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("A comparação deve ser feita entre 2 e 3 serviços."));
    }

    @Test
    void deveRetornar400QuandoNaoEnviarParametroIds() throws Exception {
        when(servicoService.compararServicos(null))
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "A comparação deve ser feita entre 2 e 3 serviços."));

        mockMvc.perform(get("/api/servicos/comparar")
                        .contextPath("/api")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("A comparação deve ser feita entre 2 e 3 serviços."));
    }

    @Test
    void deveRetornar404QuandoServicoNaoForEncontrado() throws Exception {
        when(servicoService.compararServicos(List.of(1L, 999L)))
                .thenThrow(new ServicoNotFoundException());

        mockMvc.perform(get("/api/servicos/comparar")
                        .contextPath("/api")
                        .param("ids", "1,999")
                        .with(authentication(usuarioAutenticado)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Serviço não encontrado"));
    }

    @Test
    void deveRetornar401AoTentarCompararServicosSemEstarAutenticado() throws Exception {
        mockMvc.perform(get("/api/servicos/comparar")
                        .contextPath("/api")
                        .param("ids", "1,2"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
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
