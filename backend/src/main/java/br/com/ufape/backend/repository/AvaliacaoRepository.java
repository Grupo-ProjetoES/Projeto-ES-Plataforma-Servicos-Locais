package br.com.ufape.backend.repository;

import br.com.ufape.backend.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    boolean existsByServicoIdAndUsuarioId(Long servicoId, Long usuarioId);

    @Query("SELECT a.servico.id FROM Avaliacao a "
            + "WHERE a.usuario.id = :usuarioId AND a.servico.id IN :servicoIds")
    List<Long> findServicoIdsAvaliadosPeloUsuario(
        @Param("usuarioId") Long usuarioId,
        @Param("servicoIds") List<Long> servicoIds
    );
}
