package com.room8.userservice.exception;

public class NoUpdateNeededException extends RuntimeException {
    public NoUpdateNeededException(String message) {
        super(message);
    }
}
