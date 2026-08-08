package br.com.ufape.backend.exception;

import org.springframework.http.HttpStatus;

public class InvalidServiceCategoryException extends BaseException {
    public InvalidServiceCategoryException(String category) {
        super("Categoria de atuação inválida: " + category, HttpStatus.BAD_REQUEST);
    }
}
