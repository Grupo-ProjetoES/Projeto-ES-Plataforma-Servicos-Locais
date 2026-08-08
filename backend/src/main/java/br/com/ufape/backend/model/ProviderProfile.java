package br.com.ufape.backend.model;

import br.com.ufape.backend.enums.DocumentType;
import br.com.ufape.backend.util.DocumentUtils;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "provider_profiles")
public class ProviderProfile {

    @Id
    @SequenceGenerator(name = "provider_profile_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "provider_profile_id_seq", strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Documento é obrigatório")
    private String document;

    @ElementCollection
    @CollectionTable(name = "provider_profile_phones", joinColumns = @JoinColumn(name = "provider_profile_id"))
    @Column(name = "phone", nullable = false, length = 20)
    @NotEmpty(message = "Pelo menos um telefone é obrigatório")
    private List<String> phones;

    @ElementCollection
    @CollectionTable(name = "provider_profile_service_areas", joinColumns = @JoinColumn(name = "provider_profile_id"))
    @Column(name = "service_area", nullable = false)
    @NotEmpty(message = "Pelo menos uma área de atendimento é obrigatória")
    private List<String> serviceAreas;

    @ManyToMany
    @JoinTable(
            name = "provider_profile_categories",
            joinColumns = @JoinColumn(name = "provider_profile_id"),
            inverseJoinColumns = @JoinColumn(name = "service_category_id")
    )
    @NotEmpty(message = "Pelo menos uma categoria é obrigatória")
    private Set<ServiceCategory> categories = new HashSet<>();

    @Column(nullable = false, length = 1000)
    @NotBlank(message = "Descrição é obrigatória")
    private String description;

    public ProviderProfile() {}

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDocument() {
        return document;
    }

    public void setDocument(String document) {
        this.document = document;
    }

    public DocumentType getDocumentType() {
        return DocumentUtils.tipoDocumento(document);
    }

    public List<String> getPhones() {
        return phones;
    }

    public void setPhones(List<String> phones) {
        this.phones = phones;
    }

    public List<String> getServiceAreas() {
        return serviceAreas;
    }

    public void setServiceAreas(List<String> serviceAreas) {
        this.serviceAreas = serviceAreas;
    }

    public Set<ServiceCategory> getCategories() {
        return categories;
    }

    public void setCategories(Set<ServiceCategory> categories) {
        this.categories = categories;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
