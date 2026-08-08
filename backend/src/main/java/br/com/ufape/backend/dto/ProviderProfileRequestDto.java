package br.com.ufape.backend.dto;

import br.com.ufape.backend.validation.CpfCnpj;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ProviderProfileRequestDto(
        @NotBlank(message = "Documento é obrigatório")
        @CpfCnpj(message = "Documento em formato inválido (informe um CPF ou CNPJ válido)")
        String document,

        @NotEmpty(message = "Pelo menos um telefone é obrigatório")
        List<@NotBlank(message = "Telefone não pode ser vazio") String> phones,

        @NotEmpty(message = "Pelo menos uma categoria de atuação é obrigatória")
        List<@NotBlank(message = "Categoria não pode ser vazia") String> categories,

        @NotEmpty(message = "Pelo menos uma área de atendimento é obrigatória")
        List<@NotBlank(message = "Área de atendimento não pode ser vazia") String> serviceAreas,

        @NotBlank(message = "Descrição é obrigatória")
        @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
        String description
) {
}
