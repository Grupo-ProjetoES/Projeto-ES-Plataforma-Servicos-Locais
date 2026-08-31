package br.com.ufape.backend.dto;

import br.com.ufape.backend.enums.StatusServico;

import java.time.LocalDateTime;

public record HistoricoServicoContratadoDto(
    Long id,
    String tituloServico,
    String nomePrestador,
    LocalDateTime dataContratacao,
    StatusServico status,
    Boolean avaliado
) {}
