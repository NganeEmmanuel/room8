package com.userauth.user_auth.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long userId) {
        super("user not found with ID: " + userId);

    }

    public UserNotFoundException(String message) {
        super(message);
    }
}
