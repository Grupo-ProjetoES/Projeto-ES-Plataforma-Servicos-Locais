package br.com.ufape.backend.service;

import br.com.ufape.backend.dto.ProviderProfileRequestDto;
import br.com.ufape.backend.dto.ProviderProfileResponseDto;
import br.com.ufape.backend.enums.UserRole;
import br.com.ufape.backend.exception.InvalidServiceCategoryException;
import br.com.ufape.backend.exception.ProviderProfileAlreadyExistsException;
import br.com.ufape.backend.model.ProviderProfile;
import br.com.ufape.backend.model.ServiceCategory;
import br.com.ufape.backend.model.User;
import br.com.ufape.backend.repository.ProviderProfileRepository;
import br.com.ufape.backend.repository.ServiceCategoryRepository;
import br.com.ufape.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final UserRepository userRepository;

    public ProviderProfileService(
            ProviderProfileRepository providerProfileRepository,
            ServiceCategoryRepository serviceCategoryRepository,
            UserRepository userRepository
    ) {
        this.providerProfileRepository = providerProfileRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.userRepository = userRepository;
    }

    public ProviderProfileResponseDto criar(User usuarioAutenticado, ProviderProfileRequestDto dto) {
        validatePerfilInexistente(usuarioAutenticado.getId());

        ProviderProfile profile = new ProviderProfile();
        profile.setUser(usuarioAutenticado);
        profile.setDocument(dto.document());
        profile.setPhones(dto.phones());
        profile.setServiceAreas(dto.serviceAreas());
        profile.setDescription(dto.description());
        profile.setCategories(resolveCategories(dto.categories()));

        profile = providerProfileRepository.save(profile);

        usuarioAutenticado.setRole(UserRole.PRESTADOR);
        userRepository.save(usuarioAutenticado);

        return ProviderProfileResponseDto.fromEntity(profile);
    }

    private void validatePerfilInexistente(Long userId) {
        if (providerProfileRepository.existsByUserId(userId)) {
            throw new ProviderProfileAlreadyExistsException();
        }
    }

    private Set<ServiceCategory> resolveCategories(List<String> categoryNames) {
        List<ServiceCategory> found = serviceCategoryRepository.findByNameIn(categoryNames);

        Set<String> foundNames = found.stream().map(ServiceCategory::getName).collect(Collectors.toSet());
        for (String name : categoryNames) {
            if (!foundNames.contains(name)) {
                throw new InvalidServiceCategoryException(name);
            }
        }

        return new HashSet<>(found);
    }
}
