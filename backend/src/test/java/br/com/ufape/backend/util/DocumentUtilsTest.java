package br.com.ufape.backend.util;

import br.com.ufape.backend.enums.DocumentType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DocumentUtilsTest {

    @Test
    void shouldRecognizeCpfByLength() {
        assertEquals(DocumentType.CPF, DocumentUtils.tipoDocumento("529.982.247-25"));
    }

    @Test
    void shouldRecognizeCnpjByLength() {
        assertEquals(DocumentType.CNPJ, DocumentUtils.tipoDocumento("11.444.777/0001-61"));
    }

    @Test
    void shouldReturnNullTypeForInvalidLength() {
        assertNull(DocumentUtils.tipoDocumento("123"));
    }

    @Test
    void shouldValidateCorrectCpf() {
        assertTrue(DocumentUtils.isValid("529.982.247-25"));
    }

    @Test
    void shouldValidateCorrectCnpj() {
        assertTrue(DocumentUtils.isValid("11.444.777/0001-61"));
    }

    @Test
    void shouldRejectCpfWithWrongCheckDigit() {
        assertFalse(DocumentUtils.isValid("529.982.247-24"));
    }

    @Test
    void shouldRejectCnpjWithWrongCheckDigit() {
        assertFalse(DocumentUtils.isValid("11.444.777/0001-60"));
    }

    @Test
    void shouldRejectCpfWithAllDigitsEqual() {
        assertFalse(DocumentUtils.isValid("111.111.111-11"));
    }

    @Test
    void shouldRejectDocumentWithInvalidLength() {
        assertFalse(DocumentUtils.isValid("123456"));
    }

    @Test
    void shouldRejectNullDocument() {
        assertFalse(DocumentUtils.isValid(null));
    }
}
