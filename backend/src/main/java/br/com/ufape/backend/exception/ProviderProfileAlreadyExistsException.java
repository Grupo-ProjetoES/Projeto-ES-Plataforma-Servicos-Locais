package br.com.ufape.backend.exception;

import org.springframework.http.HttpStatus;

public class ProviderProfileAlreadyExistsException extends BaseException {
    public ProviderProfileAlreadyExistsException() {
        super("Usuário já possui um perfil de prestador", HttpStatus.CONFLICT);
    }
}
