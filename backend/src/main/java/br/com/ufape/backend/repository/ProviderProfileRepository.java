package br.com.ufape.backend.repository;

import br.com.ufape.backend.model.ProviderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    boolean existsByUserId(Long userId);
}
