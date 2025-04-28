package com.room8.authservice.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long userId) {
        super("user not found with ID: " + userId);

    }

    public UserNotFoundException(String message) {
        super(message);
    }
}
