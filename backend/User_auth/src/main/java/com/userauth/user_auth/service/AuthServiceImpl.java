package com.userauth.user_auth.service;

import com.userauth.user_auth.auth.AuthenticationRefreshResponse;
import com.userauth.user_auth.auth.AuthenticationRequest;
import com.userauth.user_auth.auth.AuthenticationResponse;
import com.userauth.user_auth.auth.RegisterRequest;
import com.userauth.user_auth.enums.UserAuthority;
import com.userauth.user_auth.exception.*;
import com.userauth.user_auth.model.*;
import com.userauth.user_auth.repository.UserInfoRepository;
import com.userauth.user_auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final UserRepository userRepository;
    private final UserInfoRepository userInfoRepository;
    private final MapperService<UserDTO, User> userMapperService;
    private final MapperService<UserInfoDTO, UserInfo> userInfoMapperService;
    private final RefreshTokenService refreshTokenService;
    private final JwtBlacklistService jwtBlacklistService;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    @Override
    public ResponseEntity<AuthenticationResponse> tenantSignup(RegisterRequest request) {
        if (isEmailExist(request.getEmail())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new AuthenticationResponse());
        }

        var user = Tenant.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .authority(UserAuthority.TENANT)
                .isEmailVerified(false)
                .build();

        userRepository.save(user);

        // save userinfo for the newly created user
        var userInfo = UserInfo.builder()
                .user(user)
                .build();

        userInfoRepository.save(userInfo);

        // Generate JWT token using the username
        var jwtToken =  jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 5); //5 minutes
        var refreshToken = jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 60 * 24); // 24hrs

        // Store new jwtToken and refresh token
        refreshTokenService.storeRefreshToken(user.getEmail(), refreshToken, 60 * 24); // 1 day expiration

        return ResponseEntity.ok(AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build());
    }

    public ResponseEntity<AuthenticationResponse> landlordSignup(RegisterRequest request) {
        request.setPassword(passwordEncoder.encode(request.getPassword()));

        if (isEmailExist(request.getEmail())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new AuthenticationResponse());
        }

        var user = LandLord.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .authority(UserAuthority.LANDLORD)
                .isEmailVerified(false)
                .build();

        userRepository.save(user);

        // Generate JWT tokens using the username
        var jwtToken =  jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 5);
        var refreshToken = jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 60 * 24);

        // Store new jwtToken and refresh token
        refreshTokenService.storeRefreshToken(user.getEmail(), refreshToken, 60 * 24); // 1 day expiration

        return ResponseEntity.ok(AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build());
    }

    @Override
    public Boolean isEmailExist(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    public Boolean isCorrectEmailFormat(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    @Override
    public ResponseEntity<UserInfoDTO> getUserInfo(String token, Long userId) {
        // extract email from token, no need to check validity since auth filter already did before sending request here
        String userEmail = jwtService.extractUserEmail(token);

        //get user from database
        var requestedInfoUser = userRepository.findById(userId);
        var user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new UserNotFoundException(String.format("User with email %s not found", userEmail))
        );

        //check if user is present in tha database
        if (requestedInfoUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        //* check for authorization
        //* first check if it's the same loggedIn user's information we are trying to get using the emails. Users have authority to view their own info
        //* secondly, if it's not the same user, check if the loggedIn user has admin permission, since admins are the only other kind of users with permission to view other user's information
        if(!userEmail.equals(requestedInfoUser.get().getEmail()) && !user.getAuthority().equals(UserAuthority.ADMIN)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        //get the requested user information from the database
        var userInfo = userInfoRepository.findByUser(user).orElseThrow(
                () -> new UserNotFoundException(String.format("User with email %s not found", userEmail)) //todo creat custom userinfo exception
        );

        //Return the userinfo dto for data control
        return ResponseEntity.ok(userInfoMapperService.toDTO(userInfo));
    }

    @Override
    public ResponseEntity<AuthenticationResponse> login(AuthenticationRequest request) {
        try {
            var user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                    () -> new NoMatchingUserFoundException(request.getEmail())
            );

            // Validate password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid username or password"); //todo create a custom invalid credentials exception and return the appropriate status code
            }

            // Generate JWT token using the email
            var jwtToken =  jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 5);
            var refreshToken = jwtService.generateJwtToken(user.getEmail(), 1000 * 60 * 60 * 24);

            // Store new jwtToken and refresh token
            refreshTokenService.storeRefreshToken(user.getEmail(), refreshToken, 60 * 24); // 1 day expiration

            return ResponseEntity.ok(AuthenticationResponse.builder()
                    .token(jwtToken)
                    .refreshToken(refreshToken)
                    .build());
        } catch (NoMatchingUserFoundException ex) {
            logger.info("Error getting user while logging in with Email: {}", request.getEmail());
            throw new RuntimeException(ex);
        } catch (UserNotVerifiedException ex) {
            logger.info("Email not verified for user: {}", request.getEmail());
            throw new RuntimeException(ex);
        } catch (Exception e) {
            logger.info("Error occurred while logging in user: {}", request.getEmail());
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<String> logout(String token) {
        Date expiration = jwtService.extractExpiration(token);
        jwtBlacklistService.blacklistToken(token, expiration);
        return ResponseEntity.ok("success");
    }

    @Override
    public ResponseEntity<AuthenticationRefreshResponse> refreshToken(String refreshToken) {
        try {
            if (jwtService.isJwtTokenExpired(refreshToken)) {
                throw new TokenExpiredException();
            }

            String userEmail = jwtService.extractUserEmail(refreshToken);
            String storedToken = refreshTokenService.getRefreshToken(userEmail);

            if (storedToken == null || !storedToken.equals(refreshToken)) {
                throw new RuntimeException("Invalid refresh token");
            }

            // Generate new tokens
            String newJwtToken = jwtService.generateJwtToken(userEmail, 1000 * 60 * 5);
            String newRefreshToken = jwtService.generateJwtToken(userEmail, 1000 * 60 * 60 * 24);

            // Invalidate old refresh token
            refreshTokenService.invalidateRefreshToken(userEmail);

            // Store new refresh token
            refreshTokenService.storeRefreshToken(userEmail, newRefreshToken, 60 * 24); // 1 day expiration

            return ResponseEntity.ok(AuthenticationRefreshResponse.builder()
                    .token(newJwtToken)
                    .refreshToken(newRefreshToken)
                    .build());

        } catch (TokenExpiredException expired) {
            logger.info("Expired token while refreshing token: {}", refreshToken);
            throw new RuntimeException(expired);
        }
    }


    @Override
    public ResponseEntity<Boolean> authenticateUser(String token) {
        try {
            var userEmail = jwtService.extractUserEmail(token); // Get user email from token

            // Validate the user in the database
            userRepository.findByEmail(userEmail).orElseThrow(
                    () -> new NoMatchingUserFoundException(userEmail)
            );

            return ResponseEntity.ok(jwtService.isJwtTokenValid(token));
        } catch (NoMatchingUserFoundException ex) {
            logger.info("Error getting user from token: {}", token);
            return ResponseEntity.ok(Boolean.FALSE);
        } catch (Exception e) {
            logger.info("Error occurred while authenticating user: {}", token);
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<UserDTO> getLoggedInUser(String token) {
        try {
            if (!jwtService.isJwtTokenValid(token)) {
                throw new InvalidTokenException(token);
            }

            String userEmail = jwtService.extractUserEmail(token);
            var user = userRepository.findByEmail(userEmail).orElseThrow(
                    () -> new NoMatchingUserFoundException(userEmail)
            );

            return ResponseEntity.ok(userMapperService.toDTO(user));
        } catch (NoMatchingUserFoundException ex) {
            logger.info("Error getting logged in user. No user found matching user from token: {}", token);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (InvalidTokenException invalidTokenException){
            logger.info("Error getting logged in user. Invalid token: {}", token);
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            logger.info("Error occurred while getting logged in user from token: {}", token);
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<Long> getLoggedInUserId(String token) {
       var user = getLoggedInUser(token).getBody();
        assert user != null;
        return ResponseEntity.ok(user.getId());
    }

    @Override
    public ResponseEntity<Boolean> verifyEmail(String email, String token) {
        return null;
    }


}
