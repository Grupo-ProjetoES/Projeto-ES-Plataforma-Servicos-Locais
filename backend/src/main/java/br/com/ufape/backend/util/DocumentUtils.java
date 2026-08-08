package br.com.ufape.backend.util;

import br.com.ufape.backend.enums.DocumentType;

public class DocumentUtils {

    private DocumentUtils() {}

    private static final int[] CPF_FIRST_WEIGHTS = {10, 9, 8, 7, 6, 5, 4, 3, 2};
    private static final int[] CPF_SECOND_WEIGHTS = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
    private static final int[] CNPJ_FIRST_WEIGHTS = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
    private static final int[] CNPJ_SECOND_WEIGHTS = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    public static DocumentType tipoDocumento(String documento) {
        if (documento == null) {
            return null;
        }
        String digits = documento.replaceAll("\\D", "");
        return switch (digits.length()) {
            case 11 -> DocumentType.CPF;
            case 14 -> DocumentType.CNPJ;
            default -> null;
        };
    }

    public static boolean isValid(String documento) {
        if (documento == null) {
            return false;
        }
        String digits = documento.replaceAll("\\D", "");
        DocumentType tipo = tipoDocumento(documento);
        if (tipo == null || allDigitsEqual(digits)) {
            return false;
        }
        return switch (tipo) {
            case CPF -> isValidCpf(digits);
            case CNPJ -> isValidCnpj(digits);
        };
    }

    private static boolean isValidCpf(String digits) {
        int firstCheckDigit = calculateCheckDigit(digits, CPF_FIRST_WEIGHTS);
        int secondCheckDigit = calculateCheckDigit(digits.substring(0, 9) + firstCheckDigit, CPF_SECOND_WEIGHTS);
        return digits.charAt(9) - '0' == firstCheckDigit && digits.charAt(10) - '0' == secondCheckDigit;
    }

    private static boolean isValidCnpj(String digits) {
        int firstCheckDigit = calculateCheckDigit(digits, CNPJ_FIRST_WEIGHTS);
        int secondCheckDigit = calculateCheckDigit(digits.substring(0, 12) + firstCheckDigit, CNPJ_SECOND_WEIGHTS);
        return digits.charAt(12) - '0' == firstCheckDigit && digits.charAt(13) - '0' == secondCheckDigit;
    }

    private static int calculateCheckDigit(String base, int[] weights) {
        int sum = 0;
        for (int i = 0; i < weights.length; i++) {
            sum += (base.charAt(i) - '0') * weights[i];
        }
        int remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }

    private static boolean allDigitsEqual(String digits) {
        return digits.chars().distinct().count() == 1;
    }
}
