package com.room8.authservice.service;

import com.room8.authservice.dto.AuthenticationRequest;
import com.room8.authservice.dto.AuthenticationResponse;
import com.room8.authservice.dto.RegisterRequest;
import com.room8.authservice.exception.*;
import com.room8.authservice.dto.UserDTO;

public interface AuthService {
    /**
     * Registers a new tenant user in the system.
     *
     * @param request the user data transfer object containing the user's information
     * @throws AuthException if the user with the given email already exists or an error occurs during signup
     */
    AuthenticationResponse tenantSignup(RegisterRequest request);

    /**
     * Registers a new landlord user in the system.
     *
     * @param request the user data transfer object containing the user's information
     * @throws AuthException if the user with the given email already exists or an error occurs during signup
     */
    AuthenticationResponse landlordSignup(RegisterRequest request);

    /**
     * Authenticates a user and returns the user's data transfer object.
     *
     * @param request    contains the username and password of the user
     * @return the user data transfer object if the login is successful
     * @throws AuthException if the user with the given email is not found or the password is invalid
     */
    AuthenticationResponse login(AuthenticationRequest request);

    /**
     * Signs out user, blacklist active authentication tokens and closes session
     *
     * @param token    token to be blacklisted
     * @return a success status and message is successful
     */
    String logout(String token);

    /**
     * Registers a new user in the system.
     *
     * @param refreshToken the token to be refreshed
     * @return a refreshed authentication jwt token on success
     * @throws TokenExpiredException if token has expired
     */
    AuthenticationResponse refreshToken(String refreshToken);

    /**
     * Registers a new user in the system.
     *
     * @param token the token to be authenticated
     * @return boolean ture if valid or false if not
     * @throws TokenExpiredException if token has expired
     */
    Boolean authenticateUser(String token);

    /**
     * Get the user information from the authentication token
     *
     * @param token the token to be authenticated
     * @return userDTO object with user info if valid and an empty object if not
     * @throws TokenExpiredException if token has expired
     */
    UserDTO getLoggedInUser(String token);

    /**
     * Get the userid information from the authentication token
     *
     * @param token the token to be authenticated
     * @return userDTO object with user info if valid and an empty object if not
     * @throws TokenExpiredException if token has expired
     */
    Long getLoggedInUserId(String token);

    /**
     * Verifying the email from the client end via email verification(mark user associated with email as verified
     * @param email email of the user to me marked as verified
     * @param token the jwt verification token sent to the email
     * @return true
     * @throws UserNotFoundException if a user is not found associated with the provided email
     */
    Boolean markedAsEmailVerified(String email, String token) throws UserNotFoundException;

    /**
     * Verifying the email from the client end via email verification(mark user associated with email as verified
     * @param phoneNumber phone number of the user to me marked as verified
     * @param otp the one time pass code sent to the user phone number
     * @return true
     * @throws UserNotFoundException if a user is not found associated with the provided email
     */
    Boolean markedAsPhoneVerified(String phoneNumber, String otp) throws UserNotFoundException;

}
