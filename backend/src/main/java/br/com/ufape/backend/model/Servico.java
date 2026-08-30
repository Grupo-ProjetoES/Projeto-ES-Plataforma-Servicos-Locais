package br.com.ufape.backend.model;

import java.time.LocalDateTime;

import br.com.ufape.backend.enums.FormaCobranca;
import br.com.ufape.backend.enums.StatusServico;
import jakarta.persistence.*;

@Entity
@Table(name = "servicos")
public class Servico {

    @Id
    @SequenceGenerator(name = "servico_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "servico_id_seq", strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private String localizacao;

    @Column(nullable = false)
    private String areaAtendimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private FormaCobranca formaCobranca;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_category_id", nullable = false)
    private ServiceCategory categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_profile_id", nullable = false)
    private ProviderProfile prestador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_user_id")
    private User cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatusServico status;

    @Column(name = "data_contratacao")
    private LocalDateTime dataContratacao;

    public Servico() {
        // Construtor vazio exigido pelo JPA
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }
    public String getAreaAtendimento() { return areaAtendimento; }
    public void setAreaAtendimento(String areaAtendimento) { this.areaAtendimento = areaAtendimento; }
    public FormaCobranca getFormaCobranca() { return formaCobranca; }
    public void setFormaCobranca(FormaCobranca formaCobranca) { this.formaCobranca = formaCobranca; }
    public ServiceCategory getCategoria() { return categoria; }
    public void setCategoria(ServiceCategory categoria) { this.categoria = categoria; }
    public ProviderProfile getPrestador() { return prestador; }
    public void setPrestador(ProviderProfile prestador) { this.prestador = prestador; }
    public User getCliente() { return cliente; }
    public void setCliente(User cliente) { this.cliente = cliente; }
    public StatusServico getStatus() { return status; }
    public void setStatus(StatusServico status) { this.status = status; }
    public LocalDateTime getDataContratacao() { return dataContratacao; }
    public void setDataContratacao(LocalDateTime dataContratacao) { this.dataContratacao = dataContratacao; }
}
