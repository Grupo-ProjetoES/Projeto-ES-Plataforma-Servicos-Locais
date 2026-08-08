package br.com.ufape.backend.model;

import br.com.ufape.backend.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name="users")
public class User implements UserDetails {
    @Id
    @SequenceGenerator(name="user_id_seq", allocationSize=1)
    @GeneratedValue(generator="user_id_seq", strategy=GenerationType.SEQUENCE)
    @Column(name="id", updatable=false)
    private Long id;

    @Column(nullable=false)
    @NotBlank(message="Nome é obrigatório")
    private String name;

    @Column(nullable=false, unique=true)
    @NotBlank(message="Email é obrigatório")
    @Email(message="Email em formato inválido")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    @NotNull(message="O cargo do usuário é obrigatório")
    private UserRole role;

    @Column(nullable=false)
    @NotBlank(message="A senha é obrigatória")
    @Size(min=6, message="A senha deve ter no mínimo 6 caracteres")
    @JsonProperty(access=JsonProperty.Access.WRITE_ONLY)
    private String password;

    public User() {}

    public User(String name, String email, UserRole role, String password) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    public String getUsername() {
        return email;
    }

    public boolean isAccountNonExpired() {
        return true;
    }

    public boolean isAccountNonLocked() {
        return true;
    }

    public boolean isCredentialsNonExpired() {
        return true;
    }

    public boolean isEnabled() {
        return true;
    }

}
