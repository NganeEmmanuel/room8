package com.room8.authservice.exception;

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

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex, WebRequest request) {
        logger.error("user not found: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    /**
     * Handles PostNotFoundException and returns a meaningful response.
     *
     * @param ex The PostNotFoundException. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing the error message and HTTP status.
     */
    @ExceptionHandler(NoMatchingUserFoundException.class)
    public ResponseEntity<String> handleNoMatchingUserFoundException(NoMatchingUserFoundException ex, WebRequest request) {
        logger.error("No matching user found while looking through search keyword: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }


    /**
     * Handles TokenExpiredException and returns a meaningful response.
     *
     * @param ex The TokenExpiredException. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing the error message and HTTP status.
     */
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<String> handleTokenExpiredException(TokenExpiredException ex, WebRequest request) {
        logger.error("The provided token is expired: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_ACCEPTABLE);
    }

    /**
     * Handles UserNotVerifiedException and returns a meaningful response.
     *
     * @param ex The UserNotVerifiedException. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing the error message and HTTP status.
     */
    @ExceptionHandler(UserNotVerifiedException.class)
    public ResponseEntity<String> handleUserNotVerifiedException(UserNotVerifiedException ex, WebRequest request) {
        logger.error("User email is not verified: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.PRECONDITION_REQUIRED);
    }

    /**
     * Handles exceptions for invalidEmailFormat
     *
     * @param ex The Exception. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing a generic error message and HTTP status.
     */
    @ExceptionHandler(InvalidEmailFormatException.class)
    public ResponseEntity<String> handleInvalidEmailFormatException(Exception ex, WebRequest request) {
        logger.error("Invalid email format for registering user: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_ACCEPTABLE);
    }

    /**
     * Handles exceptions for DuplicateEmail
     *
     * @param ex The Exception. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing a generic error message and HTTP status.
     */
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<String> handleDuplicateEmailException(Exception ex, WebRequest request) {
        logger.error("Email already exit in the database: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.IM_USED);
    }

    /**
     * Handles exceptions for bad credentials(wrong password)
     *
     * @param ex The Exception. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing a generic error message and HTTP status.
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentialsException(Exception ex, WebRequest request) {
        logger.error("Bad credentials: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_ACCEPTABLE);
    }

    /**
     * Handles exceptions for bad InvalidEmailVerificationToken
     *
     * @param ex The Exception. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing a generic error message and HTTP status.
     */
    @ExceptionHandler(InvalidEmailVerificationTokenException.class)
    public ResponseEntity<String> handleInvalidEmailVerificationTokenException(Exception ex, WebRequest request) {
        logger.error("Invalid token: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_ACCEPTABLE);
    }

    /**
     * Handles exceptions for bad InvalidPhoneVerificationToken
     *
     * @param ex The Exception. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing a generic error message and HTTP status.
     */
    @ExceptionHandler(InvalidPhoneVerificationTokenException.class)
    public ResponseEntity<String> handleInvalidPhoneVerificationTokenException(Exception ex, WebRequest request) {
        logger.error("Invalid otp: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_ACCEPTABLE);
    }

    /**
     * Handles exceptions for bad EmailSending
     *
     * @param ex The Exception. This parameter allows access to the exception's message and stack trace.
     * @param request The WebRequest that led to the exception. This parameter can provide additional context about the request.
     * @return A ResponseEntity containing a generic error message and HTTP status.
     */
    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<String> handleEmailSendingException(Exception ex, WebRequest request) {
        logger.error("could not send verification email: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.EXPECTATION_FAILED);
    }


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


}
