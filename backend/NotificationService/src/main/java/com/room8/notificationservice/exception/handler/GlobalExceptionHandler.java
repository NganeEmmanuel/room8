package com.room8.notificationservice.exception.handler;

import com.room8.notificationservice.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {


     @ExceptionHandler(NotFoundException.class)
     public ResponseEntity<String> handleSomeSpecificException(NotFoundException ex) {
            // Return a custom error response
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Notification for user not found: " + ex.getMessage());
     }
}
