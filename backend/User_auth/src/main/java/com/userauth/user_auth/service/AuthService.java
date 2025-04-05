package com.userauth.user_auth.service;


import com.userauth.user_auth.auth.AuthenticationRefreshResponse;
import com.userauth.user_auth.auth.AuthenticationRequest;
import com.userauth.user_auth.auth.AuthenticationResponse;
import com.userauth.user_auth.auth.RegisterRequest;
import com.userauth.user_auth.exception.AuthException;
import com.userauth.user_auth.exception.TokenExpiredException;
import com.userauth.user_auth.model.UserDTO;
import com.userauth.user_auth.model.UserInfoDTO;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    /**
     * Registers a new tenant user in the system.
     *
     * @param request the user data transfer object containing the user's information
     * @throws AuthException if the user with the given email already exists or an error occurs during signup
     */
    ResponseEntity<AuthenticationResponse> tenantSignup(RegisterRequest request);

    /**
     * Registers a new landlord user in the system.
     *
     * @param request the user data transfer object containing the user's information
     * @throws AuthException if the user with the given email already exists or an error occurs during signup
     */
    ResponseEntity<AuthenticationResponse> landlordSignup(RegisterRequest request);

    /**
     * Authenticates a user and returns the user's data transfer object.
     *
     * @param request    contains the username and password of the user
     * @return the user data transfer object if the login is successful
     * @throws AuthException if the user with the given email is not found or the password is invalid
     */
    ResponseEntity<AuthenticationResponse> login(AuthenticationRequest request);

    /**
     * Signs out user, blacklist active authentication tokens and closes session
     *
     * @param token    token to be blacklisted
     * @return a success status and message is successful
     */
    ResponseEntity<String> logout(String token);

    /**
     * Registers a new user in the system.
     *
     * @param refreshToken the token to be refreshed
     * @return a refreshed authentication jwt token on success
     * @throws TokenExpiredException if token has expired
     */
    ResponseEntity<AuthenticationRefreshResponse> refreshToken(String refreshToken);

    /**
     * Registers a new user in the system.
     *
     * @param token the token to be authenticated
     * @return boolean ture if valid or false if not
     * @throws TokenExpiredException if token has expired
     */
    ResponseEntity<Boolean> authenticateUser(String token);

    /**
     * Get the user information from the authentication token
     *
     * @param token the token to be authenticated
     * @return userDTO object with user info if valid and an empty object if not
     * @throws TokenExpiredException if token has expired
     */
    ResponseEntity<UserDTO> getLoggedInUser(String token);

    /**
     * Get the userid information from the authentication token
     *
     * @param token the token to be authenticated
     * @return userDTO object with user info if valid and an empty object if not
     * @throws TokenExpiredException if token has expired
     */
    ResponseEntity<Long> getLoggedInUserId(String token);

    /**
     * Verifying the email from the client end via email verification
     * @param email email to be verified
     * @param token token to verify against
     * @return true
     */
    ResponseEntity<Boolean> verifyEmail(String email, String token);

    /**
     * Check if an email is in the database
     * @param email string email to confirm its existence
     * @return true if the email exist in the database, and false otherwise
     */
    Boolean isEmailExist(String email);

    /**
     * Check if a string is a correct email format
     * @param email string to check the format for correctness
     * @return true if string is a valid email format and false otherwise
     */
    Boolean isCorrectEmailFormat(String email);

    /**
     *
     * @param token barrear token to verify the user
     * @param userId id of the user whose information is to be gotten
     * @return UserInfoDTO containing the specified user's information is authorized
     */
    ResponseEntity<UserInfoDTO> getUserInfo(String token, Long userId);
}
