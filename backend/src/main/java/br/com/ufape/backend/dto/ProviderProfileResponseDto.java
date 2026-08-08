package br.com.ufape.backend.dto;

import br.com.ufape.backend.enums.DocumentType;
import br.com.ufape.backend.model.ProviderProfile;
import br.com.ufape.backend.model.ServiceCategory;

import java.util.List;

public record ProviderProfileResponseDto(
        Long id,
        Long userId,
        String document,
        DocumentType documentType,
        List<String> phones,
        List<String> categories,
        List<String> serviceAreas,
        String description
) {
    public static ProviderProfileResponseDto fromEntity(ProviderProfile profile) {
        return new ProviderProfileResponseDto(
                profile.getId(),
                profile.getUser().getId(),
                profile.getDocument(),
                profile.getDocumentType(),
                profile.getPhones(),
                profile.getCategories().stream().map(ServiceCategory::getName).toList(),
                profile.getServiceAreas(),
                profile.getDescription()
        );
    }
}
