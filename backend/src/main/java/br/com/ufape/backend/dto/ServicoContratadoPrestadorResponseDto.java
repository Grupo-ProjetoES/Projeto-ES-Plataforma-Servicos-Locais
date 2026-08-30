package br.com.ufape.backend.dto;

import br.com.ufape.backend.enums.StatusServico;

public record ServicoContratadoPrestadorResponseDto(
        Long id,
        String titulo,
        String categoria,
        String nomeContratante,
        String localAtendimento,
        String dataOuPeriodoSolicitado,
        StatusServico statusAtual
) {}
