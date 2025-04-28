package com.room8.authservice.exception;

public class InvalidPhoneVerificationTokenException extends RuntimeException {
    public InvalidPhoneVerificationTokenException(String message) {
        super(message);
    }
}
