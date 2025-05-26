package com.room8.userservice.exception;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException( String message ) {
        super("Invalid token:" + message);
    }
}
