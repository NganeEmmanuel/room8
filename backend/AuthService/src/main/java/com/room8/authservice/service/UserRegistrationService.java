package com.room8.authservice.service;

import com.room8.authservice.client.ContactServiceClient;
import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.dto.AuthenticationResponse;
import com.room8.authservice.dto.RegisterRequest;
import com.room8.authservice.dto.VerificationRequest;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.exception.DuplicateEmailException;
import com.room8.authservice.exception.EmailSendingException;
import com.room8.authservice.model.Tenant;
import com.room8.authservice.redis.EmailVerificationRedisService;
import com.room8.authservice.redis.OTPRedisService;
import com.room8.authservice.redis.RefreshTokenRedisService;
import com.room8.authservice.redis.UserRedisService;
import com.room8.authservice.utils.EmailUtils;
import com.room8.authservice.utils.RoleUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserRegistrationService {
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserServiceClient userServiceClient;
    private final RefreshTokenRedisService refreshTokenRedisService;
    private final UserRedisService userRedisService;
    private final EmailVerificationRedisService emailVerificationRedisService;
    private final OTPRedisService otpRedisService;
    private final ContactServiceClient contactServiceClient;
    private final EmailUtils emailUtils;
    private final RoleUtil roleUtil;

    /**
     * Registers a new user in the system.
     * <p>
     * This method processes the registration request and creates a new user
     * with the specified authority level. It returns an authentication response
     * that indicates the success or failure of the registration process.
     *
     * @param request The registration request containing user details.
     * @param userAuthority The authority level assigned to the user.
     * @return An AuthenticationResponse object containing the result of the registration.
     */
    public AuthenticationResponse registerUser(RegisterRequest request, UserAuthority userAuthority) {

        // check for duplicate user(if user already exits)
        emailUtils.checkUserConflict(request.getEmail(), request.getPhoneNumber());

        // build user, add roles, encrypt password
        var user = Tenant.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .role(roleUtil.generateRole(userAuthority))
                .build();

        // adds user to the database by sending a request to the user service
        user = userServiceClient.addUser(user).getBody();

        assert user != null; // check if user was added (returned user object is not null)

        // save user information in cache for future reference with expiration time of 5hrs
        userRedisService.storeUserInformation(user.getEmail(), user,  60 * 5);  // 5hrs

        //get string form of roles
        var roleStringList = roleUtil.getRoleList(user.getRole());

        // Generate JWT tokens (normal token and refresh token) using the username
        var jwtToken =  jwtService.generateTokenWithRoles(user.getEmail(), roleStringList, 1000 * 60 * 5); //5 minutes
        var refreshToken = jwtService.generateTokenWithRoles(user.getEmail(), roleStringList, 1000 * 60 * 60 * 24); // 24hrs

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
//
//        //send verification email
//        var isEmailSent = contactServiceClient.sendVerificationEmail(verificationRequest).getBody();
//
//        // check if email was sent
//        if(Boolean.FALSE.equals(isEmailSent)){
//            throw new EmailSendingException("Failed to send verification email");
//        }

        // Build refresh token
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }
}
