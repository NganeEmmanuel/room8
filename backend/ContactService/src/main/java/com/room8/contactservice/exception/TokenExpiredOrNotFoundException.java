package com.room8.contactservice.exception;

// TokenExpiredOrNotFoundException.java
public class TokenExpiredOrNotFoundException extends RuntimeException {
    public TokenExpiredOrNotFoundException(String message) {
        super(message);
    }
}
