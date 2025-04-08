package com.room8.contactservice.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@SuppressWarnings("unused")
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles all other exceptions and returns a generic error response.
     *
     * @param ex The Exception. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing a generic error message and HTTP status.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalException(Exception ex, WebRequest request) {
        logger.error("Unexpected error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(EmailSendException.class)
    public ResponseEntity<String> handleEmailSendException(EmailSendException ex, WebRequest request) {
        logger.error("Unexpected error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("An error occurred while sending an email", HttpStatus.EXPECTATION_FAILED);
    }

    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<String> handleEmailSendingException(EmailSendingException ex, WebRequest request) {
        logger.error("An error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("Un able to send mail", HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<String> handleInvalidTokenException(InvalidTokenException ex, WebRequest request) {
        logger.error("An error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("Invalid token", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SmsCodeStorageException.class)
    public ResponseEntity<String> handleSmsCodeStorageException(SmsCodeStorageException ex, WebRequest request) {
        logger.error("An error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("Error saving sms code", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TokenExpiredOrNotFoundException.class)
    public ResponseEntity<String> handleTokenExpiredOrNotFoundException(TokenExpiredOrNotFoundException ex, WebRequest request) {
        logger.error("An error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("Token expired or not present", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(TokenStorageException.class)
    public ResponseEntity<String> handleTokenStorageException(TokenStorageException ex, WebRequest request) {
        logger.error("An error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("Error saving verification token", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TokenVerificationException.class)
    public ResponseEntity<String> handleTokenVerificationException(TokenVerificationException ex, WebRequest request) {
        logger.error("An error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("Error verifying token", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(EmailAndTokenMissMatchException.class)
    public ResponseEntity<String> handleEmailAndTokenMissMatchException(EmailAndTokenMissMatchException ex, WebRequest request) {
        logger.error("An error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("Email and token mismatch", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserAuthMarkedAsVerifiedException.class)
    public ResponseEntity<String> handleUserAuthMarkedAsVerified(UserAuthMarkedAsVerifiedException ex, WebRequest request) {
        logger.error("An error occurred: {}", ex.getMessage(), ex);
        return new ResponseEntity<>("User auth marked as verified", HttpStatus.UNAUTHORIZED);
    }

}
