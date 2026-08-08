package br.com.ufape.backend.controller;

import br.com.ufape.backend.dto.ProviderProfileRequestDto;
import br.com.ufape.backend.dto.ProviderProfileResponseDto;
import br.com.ufape.backend.model.User;
import br.com.ufape.backend.service.ProviderProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/prestadores")
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;

    public ProviderProfileController(ProviderProfileService providerProfileService) {
        this.providerProfileService = providerProfileService;
    }

    @PostMapping
    public ResponseEntity<ProviderProfileResponseDto> criar(
            @AuthenticationPrincipal User usuarioAutenticado,
            @RequestBody @Valid ProviderProfileRequestDto dto
    ) {
        ProviderProfileResponseDto response = providerProfileService.criar(usuarioAutenticado, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
