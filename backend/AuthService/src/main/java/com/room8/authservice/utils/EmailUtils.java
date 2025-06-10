package com.room8.authservice.utils;

import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.exception.DuplicateEmailException;
import com.room8.authservice.exception.UserNotFoundException;
import com.room8.authservice.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class EmailUtils {
    private final JwtService jwtService;
    private final UserServiceClient userServiceClient;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    /**
     * Check if an email is not present in the database
     * @param email string email to confirm its existence
     * @return true if the email doesn't exist in the database, and false otherwise
     */
    public Boolean isEmailNotExist(String email) {
        try {
            userServiceClient.getUserFromEmail(email); // No need to check status code now
            return Boolean.FALSE; // Email exists
        } catch (UserNotFoundException e) {
            return Boolean.TRUE; // Email does not exist
        }
    }

    public Boolean isPhoneNumberNotExist(String phoneNumber) {
        try {
            userServiceClient.getUserFromPhoneNumber(phoneNumber); // No need to check status code now
            return Boolean.FALSE; // phone exists
        } catch (UserNotFoundException e) {
            return Boolean.TRUE; // phone does not exist
        }
    }

    public void checkUserConflict(String email, String phoneNumber) {
        if(!isEmailNotExist(email)) {
            throw new DuplicateEmailException("Email: " + email + " already in use");
        }

        if(!isPhoneNumberNotExist(phoneNumber)) {
            throw new DuplicateEmailException("PhoneNumber: " + phoneNumber + " already in use");
        }
    }

    /**
     * Check if a string is a correct email format
     * @param email string to check the format for correctness
     * @return true if string is a valid email format and false otherwise
     */
    public Boolean isCorrectEmailFormat(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Extracts the email from the jwt token
     * @param token jwt token from which the user's email is to be extracted
     * @return extracted email if token is valid and error if not
     */
    public String extractEmailFromToken(String token) {
        return jwtService.extractUserEmail(token);
    }
}
