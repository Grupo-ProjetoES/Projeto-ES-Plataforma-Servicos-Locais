package br.com.ufape.backend.repository;

import br.com.ufape.backend.enums.StatusServico;
import br.com.ufape.backend.model.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    List<Orcamento> findByPrestadorUserId(Long usuarioId);

    // Busca os orçamentos criados pelo solicitante (cliente)
    List<Orcamento> findBySolicitanteId(Long solicitanteId);

    // Busca os orçamentos aceitos do prestador cujo serviço ainda não teve a execução iniciada
    @Query("""
        SELECT o
        FROM Orcamento o
        JOIN FETCH o.servico s
        JOIN FETCH s.categoria
        JOIN FETCH o.solicitante
        WHERE o.prestador.user.id = :usuarioId
          AND o.statusResposta = 'ACEITO'
          AND s.status = :status
        """)
    List<Orcamento> findContratadosNaoIniciadosByPrestadorUserId(
        @Param("usuarioId") Long usuarioId,
        @Param("status") StatusServico status
    );
}
