package br.com.ufape.backend.dto;

import br.com.ufape.backend.enums.FormaCobranca;

public record ServicoComparacaoResponseDto(
    Long id,
    String titulo,
    String categoria,
    String bairro,
    String cidade,
    FormaCobranca formaCobranca,
    String nomePrestador,
    Double notaMediaPrestador,
    Long totalAvaliacoesPrestador
) {}
