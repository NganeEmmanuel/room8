package com.room8.authservice.service;

import com.room8.authservice.auth.AuthenticationRequest;
import com.room8.authservice.auth.AuthenticationResponse;
import com.room8.authservice.auth.RegisterRequest;
import com.room8.authservice.client.ContactServiceClient;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.exception.*;
import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.model.*;
import com.room8.authservice.redis.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final UserServiceClient userServiceClient;
    private final MapperService<UserDTO, User> userMapperService;
    private final RefreshTokenRedisService refreshTokenRedisService;
    private final JwtBlacklistRedisService jwtBlacklistRedisService;
    private final UserRedisService userRedisService;
    private final EmailVerificationRedisService emailVerificationRedisService;
    private final OTPRedisService otpRedisService;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);
    private final ContactServiceClient contactServiceClient;

    @Override
    public AuthenticationResponse tenantSignup(RegisterRequest request) {

        // check for duplicate user(if user already exits)
        if (!isEmailNotExist(request.getEmail())){
            throw new DuplicateEmailException("Email: "+ request.getEmail() + " already exists");
        }

        // generate role and add authority
        var roles = new ArrayList<UserRole>();
        roles.add(UserRole.builder()
                .userAuthority(UserAuthority.TENANT)
                .build());

        // build user, add roles, encrypt password
        var user = Tenant.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(roles)
                .build();

        // adds user to the database by sending a request to the user service
        user = userServiceClient.addUser(user).getBody();

        assert user != null; // check if user was added (returned user object is not null)

        // save user information in cache for future reference with expiration time of 5hrs
        userRedisService.storeUserInformation(user.getEmail(), user,  60 * 5);  // 5hrs

        // Generate JWT tokens (normal token and refresh token) using the username
        var jwtToken =  jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 5); //5 minutes
        var refreshToken = jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 60 * 24); // 24hrs

        // Store new jwtToken and refresh token
        refreshTokenRedisService.storeRefreshToken(user.getEmail(), refreshToken, 60 * 24); // 1 day expiration

        // Generate a temporary email verification access token for 1 time use
        var emailToken = jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 30);  // 30 minutes expiration

        // save the email verification and the OTP in the cache
        emailVerificationRedisService.storeEmailToken(user.getEmail(), emailToken, 30);
        otpRedisService.storeOTP(request.getPhoneNumber(), request.getOtp(), 30);

        //build verification request objects to use to send email request to contact service
        var verificationRequest = VerificationRequest.builder()
                .email(user.getEmail())
                .token(emailToken)
                .build();

        //send verification email
        var isEmailSent = contactServiceClient.sendVerificationEmail(verificationRequest).getBody();

        // check if email was sent
        if(Boolean.FALSE.equals(isEmailSent)){
            throw new EmailSendingException("Failed to send verification email");
        }

        // Build refresh token
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public AuthenticationResponse landlordSignup(RegisterRequest request) {

        // check for duplicate user(if user already exits)
        if (!isEmailNotExist(request.getEmail())){
            throw new DuplicateEmailException("Email: "+ request.getEmail() + " already exists");
        }

        // generate role and add authority
        var roles = new ArrayList<UserRole>();
        roles.add(UserRole.builder()
                .userAuthority(UserAuthority.LANDLORD)
                .build());

        // build user, add roles, encrypt password
        var user = Tenant.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(roles)
                .build();

        // adds user to the database by sending a request to the user service
        user = userServiceClient.addUser(user).getBody();

        assert user != null; // check if user was added (returned user object is not null)

        // save user information in cache for future reference with expiration time of 5hrs
        userRedisService.storeUserInformation(user.getEmail(), user,  60 * 5);  // 5hrs

        // Generate JWT tokens (normal token and refresh token) using the username
        var jwtToken =  jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 5); //5 minutes
        var refreshToken = jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 60 * 24); // 24hrs

        // Store new jwtToken and refresh token
        refreshTokenRedisService.storeRefreshToken(user.getEmail(), refreshToken, 60 * 24); // 1 day expiration

        // Generate a temporary email verification access token for 1 time use
        var emailToken = jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 30);  // 30 minutes expiration

        // save the email verification and the OTP in the cache
        emailVerificationRedisService.storeEmailToken(user.getEmail(), emailToken, 30);
        otpRedisService.storeOTP(request.getPhoneNumber(), request.getOtp(), 30);

        //build verification request objects to use to send email request to contact service
        var verificationRequest = VerificationRequest.builder()
                .email(user.getEmail())
                .token(emailToken)
                .build();

        //send verification email
        var isEmailSent = contactServiceClient.sendVerificationEmail(verificationRequest).getBody();

        // check if email was sent
        if(Boolean.FALSE.equals(isEmailSent)){
            throw new EmailSendingException("Failed to send verification email");
        }

        // Build refresh token
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }



    @Override
    public Boolean isEmailNotExist(String email) {
        var statusCode = userServiceClient.getUserFromEmail(email).getStatusCode();
        return statusCode == HttpStatus.NOT_FOUND || statusCode == HttpStatus.CONFLICT;
    }

    @Override
    public Boolean isCorrectEmailFormat(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    @Override
    public String extractEmailFromToken(String token) {
        return jwtService.extractUserEmail(token);
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

        // Generate JWT token using the email
        var jwtToken =  jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 5);
        var refreshToken = jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 60 * 24);

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
        if (jwtService.isJwtTokenExpired(refreshToken)) {
            throw new TokenExpiredException();
        }

        String userEmail = jwtService.extractUserEmail(refreshToken);
        String storedToken = refreshTokenRedisService.getRefreshToken(userEmail);

        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // Generate new tokens
        String newJwtToken = jwtService.generateJwtToken(userEmail, 1000 * 60 * 5);
        String newRefreshToken = jwtService.generateJwtToken(userEmail, 1000 * 60 * 60 * 24);

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
        user = userServiceClient.markUserAsEmailVerified(email).getBody();;
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

        // get the store otp from the cache
        var storedOTP = otpRedisService.getOTP(phoneNumber);

        // verify that the number exist and the opt matches
        if (storedOTP.isBlank() || !storedOTP.equals(otp)) {
            throw new InvalidPhoneVerificationTokenException("Invalid ene time pass code(OTP)");
        }

        // update user information in the database to indicate phone is verified
        user = userServiceClient.markUserAsPhoneVerified(phoneNumber).getBody();;
        assert user != null;

        // Invalidate OTP
        otpRedisService.invalidateOTP(phoneNumber);

        //update cache with new expiration date of 5hrs
        userRedisService.updateUserInformation(user.getEmail(), user, 60 * 5);

        return user.getIsEmailVerified();
    }


}
