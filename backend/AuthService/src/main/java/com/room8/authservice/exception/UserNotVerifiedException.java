package com.room8.authservice.exception;

public class UserNotVerifiedException extends RuntimeException{
    public UserNotVerifiedException(Long userId) {
        super("user email not verified with ID: " + userId);

    }
}
