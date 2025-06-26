package com.room8.authservice.service;

import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.dto.*;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.exception.*;
import com.room8.authservice.model.*;
import com.room8.authservice.redis.*;
import com.room8.authservice.utils.RoleUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserServiceClient userServiceClient;
    private final MapperService<UserDTO, User> userMapperService;
    private final RefreshTokenRedisService refreshTokenRedisService;
    private final JwtBlacklistRedisService jwtBlacklistRedisService;
    private final UserRedisService userRedisService;
    private final EmailVerificationRedisService emailVerificationRedisService;
    private final OTPRedisService otpRedisService;
    private final UserRegistrationService userRegistrationService;
    private final RoleUtil roleUtil;
    private final OtpService otpService;

    @Override
    public AuthenticationResponse tenantSignup(RegisterRequest request) {
        return userRegistrationService.registerUser(request, UserAuthority.TENANT);
    }

    @Override
    public AuthenticationResponse landlordSignup(RegisterRequest request) {
        return userRegistrationService.registerUser(request, UserAuthority.LANDLORD);
    }


    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {

        // first check local cache for user first, if not present then we catch the error thrown by the user service
        var user = userRedisService.getUserInformation(request.getEmail()).orElseGet(
                () -> userServiceClient.getUserFromEmail(request.getEmail()).getBody() //get from user service
        );

        assert user != null;

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid Credentials");
        }

        // get roles
        List<String> roles = roleUtil.getRoleList(user.getRole());

        // Generate JWT token using the email
        var jwtToken =  jwtService.generateTokenWithRoles(user.getEmail(), roles, 1000 * 60 * 30);
        var refreshToken = jwtService.generateTokenWithRoles(user.getEmail(), roles, 1000 * 60 * 60 * 24);

        // Store new jwtToken and refresh token
        refreshTokenRedisService.storeRefreshToken(user.getEmail(), refreshToken, 60 * 24); // 1 day expiration

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public String logout(String token) {
        Date expiration = jwtService.extractExpiration(token);
        jwtBlacklistRedisService.blacklistToken(token, expiration);
        return "success";
    }

    @Override
    public AuthenticationResponse refreshToken(String refreshToken) {
        if (!jwtService.isJwtTokenValid(refreshToken) || refreshToken == null) {
            throw new InvalidTokenException("Invalid Refresh Token");
        }

        String userEmail = jwtService.extractUserEmail(refreshToken);
        String storedToken = refreshTokenRedisService.getRefreshToken(userEmail);

        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new InvalidTokenException("Invalid Refresh Token");
        }

        var user = userRedisService.getUserInformation(userEmail).orElseGet(
                () -> userServiceClient.getUserFromEmail(userEmail).getBody()
        );

        assert user != null;
        var roles = roleUtil.getRoleList(user.getRole());

        // Generate new tokens
        String newJwtToken = jwtService.generateTokenWithRoles(userEmail, roles, 1000 * 60 * 5);
        String newRefreshToken = jwtService.generateTokenWithRoles(userEmail, roles,1000 * 60 * 60 * 24);

        // Invalidate old refresh token
        refreshTokenRedisService.invalidateRefreshToken(userEmail);

        // Store new refresh token
        refreshTokenRedisService.storeRefreshToken(userEmail, newRefreshToken, 60 * 24); // 1 day expiration

        return AuthenticationResponse.builder()
                .token(newJwtToken)
                .refreshToken(newRefreshToken)
                .build();
    }


    @Override
    public Boolean authenticateUser(String token) {
        var userEmail = jwtService.extractUserEmail(token); // Get user email from token

        // get check local cache for user first, if not present then we catch the error thrown by the user service in th globalExceptionHandler
        userRedisService.getUserInformation(userEmail).orElseGet(
                () -> userServiceClient.getUserFromEmail(userEmail).getBody() //get from user service
        );

        return jwtService.isJwtTokenValid(token);

    }

    @Override
    public UserDTO getLoggedInUser(String token) {
        if (!jwtService.isJwtTokenValid(token)) {
            throw new InvalidTokenException(token);
        }

        String userEmail = jwtService.extractUserEmail(token);


        // get check local cache for user first, if not present then we catch the error thrown by the user service
        var user = userRedisService.getUserInformation(userEmail).orElseGet(
                () -> userServiceClient.getUserFromEmail(userEmail).getBody() //get from user service
        );

        assert user != null;
        return userMapperService.toDTO(user);

    }

    public Long getLoggedInUserId(String token) {
        var user = getLoggedInUser(token);
        assert user != null;
        return user.getId();
    }

    @Override
    public Boolean markedAsEmailVerified(String email, String token) throws UserNotFoundException {
        // Attempt to get the user information from the cache first and contact user service if not found in cache
        var user = userRedisService.getUserInformation(email).orElseGet(
                () -> userServiceClient.getUserFromEmail(email).getBody()
        );

        assert user != null;
        if(user.getIsEmailVerified().equals(Boolean.TRUE)){
            return Boolean.TRUE;
        }

        // verify token by checking cache for existing key and matching tokens
        var storedToken = emailVerificationRedisService.getEmailToken(email);
        if (storedToken.isBlank() || !storedToken.equals(token)) {
            throw new InvalidEmailVerificationTokenException("Invalid email verification token");
        }

        // update user information in the database to indicate email is verified
        user = userServiceClient.markUserAsEmailVerified(email).getBody();
        assert user != null;

        // invalidate email token in cache
        emailVerificationRedisService.invalidateEmailToken(email);

        //update cache with new expiration date of 5hrs
        userRedisService.updateUserInformation(user.getEmail(), user, 60 * 5);

        return user.getIsEmailVerified();
    }

    @Override
    public Boolean markedAsPhoneVerified(String phoneNumber, String otp) throws UserNotFoundException {
        // Attempt to get the user information from the user service
        var user = userServiceClient.getUserFromPhoneNumber(phoneNumber).getBody();

        assert user != null;

        // check if user is already verified
        if(user.getIsPhoneVerified().equals(Boolean.TRUE)){
            return Boolean.TRUE;
        }


        if(!otpService.verifyOtp(phoneNumber, otp)){
            throw new InvalidPhoneVerificationTokenException("Invalid one-time pass code (OTP)");
        }
        // get the store otp from the cache
//        var storedOTP = otpRedisService.getOTP(phoneNumber);
//
//        // verify that the number exist and the opt matches
//        if (storedOTP.isBlank() || !storedOTP.equals(otp)) {
//            throw new InvalidPhoneVerificationTokenException("Invalid ene time pass code(OTP)");
//        }

        // update user information in the database to indicate phone is verified
        user = userServiceClient.markUserAsPhoneVerified(phoneNumber).getBody();
        assert user != null;

        // Invalidate OTP
//        otpRedisService.invalidateOTP(phoneNumber);

        //update cache with new expiration date of 5hrs
        userRedisService.updateUserInformation(user.getEmail(), user, 60 * 5);

        return user.getIsPhoneVerified();
    }

    @Override
    public Boolean resentCode(String mediumValue, String type) {
        if (type.equals("phone")) {
            if (mediumValue.isEmpty()) {
                throw new BadCredentialsException("Invalid phone number");
            }

            otpService.sendOtp(mediumValue);
            return Boolean.TRUE;
        }else if (type.equals("email")) {
            return true;
        }else {
            throw new BadCredentialsException("resend type");
        }

    }


}
