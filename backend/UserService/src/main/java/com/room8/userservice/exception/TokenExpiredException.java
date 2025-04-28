package com.room8.userservice.exception;

public class TokenExpiredException extends RuntimeException{
    public TokenExpiredException() {
        super("The provided token is expired");

    }
}
