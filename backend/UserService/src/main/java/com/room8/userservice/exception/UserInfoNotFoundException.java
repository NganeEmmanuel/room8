package com.room8.userservice.exception;

public class UserInfoNotFoundException extends RuntimeException {
    public UserInfoNotFoundException(String message) {
        super(message);
    }
}
