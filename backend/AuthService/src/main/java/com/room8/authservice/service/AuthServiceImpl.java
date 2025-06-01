package com.room8.authservice.service;

import com.room8.authservice.auth.AuthenticationRequest;
import com.room8.authservice.auth.AuthenticationResponse;
import com.room8.authservice.auth.RegisterRequest;
import com.room8.authservice.client.ContactServiceClient;
import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.exception.*;
import com.room8.authservice.model.*;
import com.room8.authservice.redis.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserServiceClient userServiceClient;
    private final ContactServiceClient contactServiceClient;
    private final MapperService<UserDTO, User> userMapperService;
    private final RefreshTokenRedisService refreshTokenRedisService;
    private final JwtBlacklistRedisService jwtBlacklistRedisService;
    private final UserRedisService userRedisService;
    private final EmailVerificationRedisService emailVerificationRedisService;
    private final OTPRedisService otpRedisService;
    private final UserRoleRedisService userRoleRedisService;

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final int FIVE_MINUTES = 1000 * 60 * 5;
    private static final int TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;
    private static final int OTP_EXPIRATION_MINUTES = 30;

    @Override
    public AuthenticationResponse tenantSignup(RegisterRequest request) {
        return handleSignup(request, UserAuthority.TENANT);
    }

    @Override
    public AuthenticationResponse landlordSignup(RegisterRequest request) {
        return handleSignup(request, UserAuthority.LANDLORD);
    }

    private AuthenticationResponse handleSignup(RegisterRequest request, UserAuthority authority) {
        if (!isEmailNotExist(request.getEmail())) {
            throw new DuplicateEmailException("Email: " + request.getEmail() + " already in use");
        }

        var role = Optional.ofNullable(userRoleRedisService.getUserRole(authority.toString()))
                .orElseGet(() -> {
                    var r = userServiceClient.getRole(authority).getBody();
                    userRoleRedisService.storeUserRole(authority.toString(), r, 60 * 24);
                    return r;
                });

        assert role != null;
        var user = Tenant.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(List.of(role))
                .build();

        user = userServiceClient.addUser(user).getBody();
        if (user == null) throw new RuntimeException("User creation failed");

        userRedisService.storeUserInformation(user.getEmail(), user, 60 * 5);
        var roleList = getRoleList(user.getRole());

        String jwtToken = jwtService.generateTokenWithRoles(user.getEmail(), roleList, FIVE_MINUTES);
        String refreshToken = jwtService.generateTokenWithRoles(user.getEmail(), roleList, TWENTY_FOUR_HOURS);
        refreshTokenRedisService.storeRefreshToken(user.getEmail(), refreshToken, 60 * 24);

        String emailToken = jwtService.generateJwtToken(user.getEmail(), OTP_EXPIRATION_MINUTES * 1000 * 60);
        emailVerificationRedisService.storeEmailToken(user.getEmail(), emailToken, OTP_EXPIRATION_MINUTES);
        otpRedisService.storeOTP(request.getPhoneNumber(), request.getOtp(), OTP_EXPIRATION_MINUTES);

        var verificationRequest = VerificationRequest.builder()
                .email(user.getEmail())
                .token(emailToken)
                .build();

        if (Boolean.FALSE.equals(contactServiceClient.sendVerificationEmail(verificationRequest).getBody())) {
            throw new EmailSendingException("Failed to send verification email");
        }

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public Boolean isEmailNotExist(String email) {
        try {
            userServiceClient.getUserFromEmail(email);
            return Boolean.FALSE;
        } catch (UserNotFoundException e) {
            return Boolean.TRUE;
        }
    }

    @Override
    public Boolean isCorrectEmailFormat(String email) {
        return email != null && !email.isEmpty() && EMAIL_PATTERN.matcher(email).matches();
    }

    @Override
    public String extractEmailFromToken(String token) {
        return jwtService.extractUserEmail(token);
    }

    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {
        var user = userRedisService.getUserInformation(request.getEmail())
                .orElseGet(() -> userServiceClient.getUserFromEmail(request.getEmail()).getBody());

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid Credentials");
        }

        var roles = getRoleList(user.getRole());
        var jwtToken = jwtService.generateTokenWithRoles(user.getEmail(), roles, FIVE_MINUTES);
        var refreshToken = jwtService.generateTokenWithRoles(user.getEmail(), roles, TWENTY_FOUR_HOURS);
        refreshTokenRedisService.storeRefreshToken(user.getEmail(), refreshToken, 60 * 24);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public String logout(String token) {
        jwtBlacklistRedisService.blacklistToken(token, jwtService.extractExpiration(token));
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

        var user = userRedisService.getUserInformation(userEmail)
                .orElseGet(() -> userServiceClient.getUserFromEmail(userEmail).getBody());
        if (user == null) throw new RuntimeException("User not found");

        var roles = getRoleList(user.getRole());
        String newJwtToken = jwtService.generateTokenWithRoles(userEmail, roles, FIVE_MINUTES);
        String newRefreshToken = jwtService.generateTokenWithRoles(userEmail, roles, TWENTY_FOUR_HOURS);

        refreshTokenRedisService.invalidateRefreshToken(userEmail);
        refreshTokenRedisService.storeRefreshToken(userEmail, newRefreshToken, 60 * 24);

        return AuthenticationResponse.builder()
                .token(newJwtToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Override
    public Boolean authenticateUser(String token) {
        var userEmail = jwtService.extractUserEmail(token);
        userRedisService.getUserInformation(userEmail)
                .orElseGet(() -> userServiceClient.getUserFromEmail(userEmail).getBody());
        return jwtService.isJwtTokenValid(token);
    }

    @Override
    public UserDTO getLoggedInUser(String token) {
        if (!jwtService.isJwtTokenValid(token)) {
            throw new InvalidTokenException(token);
        }
        var email = jwtService.extractUserEmail(token);
        return userMapperService.toDTO(userRedisService.getUserInformation(email)
                .orElseGet(() -> userServiceClient.getUserFromEmail(email).getBody()));
    }

    private List<String> getRoleList(List<UserRole> roles) {
        return roles.stream().map(UserRole::getUserAuthority::toString).toList();
    }
}