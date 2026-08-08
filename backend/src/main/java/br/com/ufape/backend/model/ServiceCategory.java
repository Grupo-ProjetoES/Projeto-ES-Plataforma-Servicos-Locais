package br.com.ufape.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "service_categories")
public class ServiceCategory {

    @Id
    @SequenceGenerator(name = "service_category_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "service_category_id_seq", strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    public ServiceCategory() {}

    public ServiceCategory(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
