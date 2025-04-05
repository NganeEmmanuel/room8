package com.userauth.user_auth.exception;

public class TokenExpiredException extends RuntimeException{
    public TokenExpiredException() {
        super("The provided token is expired");

    }
}
