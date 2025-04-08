package com.room8.contactservice.exception;

public class UserAuthMarkedAsVerifiedException extends RuntimeException {
    public UserAuthMarkedAsVerifiedException(String message) {
        super(message);
    }
}
