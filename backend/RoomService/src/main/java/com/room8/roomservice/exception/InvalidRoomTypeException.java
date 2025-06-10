package com.room8.roomservice.exception;

public class InvalidRoomTypeException extends RuntimeException {
    public InvalidRoomTypeException(String message) {
        super(message);
    }
}
