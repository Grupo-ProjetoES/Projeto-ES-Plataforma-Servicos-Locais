package br.com.ufape.backend.dto;

import java.time.LocalDateTime; 

public record HistoricoServicoContratadoDto(
    Long id,
    String tituloServico,
    String nomePrestador,
    LocalDateTime dataContratacao, 
    String status,
    Boolean avaliado 
) {}
