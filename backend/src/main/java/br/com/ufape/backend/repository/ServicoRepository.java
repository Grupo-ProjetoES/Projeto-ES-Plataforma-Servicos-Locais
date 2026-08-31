package br.com.ufape.backend.repository;

import br.com.ufape.backend.enums.StatusServico;
import br.com.ufape.backend.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    
    @Query("SELECT s FROM Servico s WHERE " +
       "(:categoria IS NULL OR LOWER(s.categoria.name) = :categoria) AND " +
       "(:cidade IS NULL OR LOWER(s.areaAtendimento) LIKE :cidade) AND " +
       "(:bairro IS NULL OR LOWER(s.localizacao) LIKE :bairro)")
    List<Servico> buscarComFiltrosOpcionais(
        @Param("categoria") String categoria, 
        @Param("cidade") String cidade, 
        @Param("bairro") String bairro
    );
    
    List<Servico> findByPrestadorUserId(Long usuarioId);

    @Query("""
        SELECT s
        FROM Servico s
        JOIN FETCH s.categoria
        JOIN FETCH s.prestador p
        JOIN FETCH p.user
        WHERE s.cliente.id = :usuarioId
          AND s.status IN :statuses
        """)
    List<Servico> findContratadosByClienteId(
        @Param("usuarioId") Long usuarioId,
        @Param("statuses") List<StatusServico> statuses
    );
    
    List<Servico> findByClienteId(Long clienteId);
}
