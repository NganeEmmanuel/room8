package com.room8.contactservice.exception;

public class EmailAndTokenMissMatchException extends RuntimeException {
    public EmailAndTokenMissMatchException(String message) {
        super(message);
    }
}
