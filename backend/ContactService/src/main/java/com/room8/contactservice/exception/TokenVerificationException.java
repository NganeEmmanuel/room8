package com.room8.contactservice.exception;

public class TokenVerificationException extends RuntimeException {
    public TokenVerificationException(String message, Throwable cause) {
        super(message, cause);
    }
}
