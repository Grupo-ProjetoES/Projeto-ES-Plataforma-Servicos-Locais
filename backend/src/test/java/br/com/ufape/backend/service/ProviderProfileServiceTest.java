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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProviderProfileServiceTest {

    @Mock
    private ProviderProfileRepository providerProfileRepository;

    @Mock
    private ServiceCategoryRepository serviceCategoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProviderProfileService providerProfileService;

    private User usuario() {
        User user = new User("Ana", "ana@email.com", UserRole.USER, "encoded-password");
        user.setId(1L);
        return user;
    }

    private ProviderProfileRequestDto requestValido() {
        return new ProviderProfileRequestDto(
                "529.982.247-25",
                List.of("81999999999"),
                List.of("Eletricista"),
                List.of("Recife"),
                "Atendo em toda a região metropolitana"
        );
    }

    @Test
    void shouldCreateProfileAndPromoteUserToPrestador() {
        User user = usuario();
        when(providerProfileRepository.existsByUserId(user.getId())).thenReturn(false);
        when(serviceCategoryRepository.findByNameIn(List.of("Eletricista")))
                .thenReturn(List.of(new ServiceCategory("Eletricista")));
        when(providerProfileRepository.save(any(ProviderProfile.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ProviderProfileResponseDto response = providerProfileService.criar(user, requestValido());

        assertEquals("529.982.247-25", response.document());
        assertEquals(UserRole.PRESTADOR, user.getRole());
        verify(userRepository).save(user);
    }

    @Test
    void shouldRejectWhenUserAlreadyHasProfile() {
        User user = usuario();
        when(providerProfileRepository.existsByUserId(user.getId())).thenReturn(true);

        assertThrows(ProviderProfileAlreadyExistsException.class,
                () -> providerProfileService.criar(user, requestValido()));

        verify(providerProfileRepository, never()).save(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldRejectWhenCategoryDoesNotExist() {
        User user = usuario();
        when(providerProfileRepository.existsByUserId(user.getId())).thenReturn(false);
        when(serviceCategoryRepository.findByNameIn(List.of("Eletricista")))
                .thenReturn(List.of());

        assertThrows(InvalidServiceCategoryException.class,
                () -> providerProfileService.criar(user, requestValido()));

        verify(providerProfileRepository, never()).save(any());
        verify(userRepository, never()).save(any());
    }
}
