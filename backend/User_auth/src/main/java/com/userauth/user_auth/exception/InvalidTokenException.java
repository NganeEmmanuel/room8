package com.userauth.user_auth.exception;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException( String message ) {
        super("Invalid token:" + message);
    }
}
