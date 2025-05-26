package com.room8.authservice.exception;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException( String message ) {
        super("Invalid token:" + message);
    }
}
