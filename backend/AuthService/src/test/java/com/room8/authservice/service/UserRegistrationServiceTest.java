//package com.room8.authservice.service;
//
//import com.room8.authservice.client.ContactServiceClient;
//import com.room8.authservice.client.UserServiceClient;
//import com.room8.authservice.dto.AuthenticationResponse;
//import com.room8.authservice.dto.RegisterRequest;
//import com.room8.authservice.dto.VerificationRequest;
//import com.room8.authservice.enums.UserAuthority;
//import com.room8.authservice.exception.DuplicateEmailException;
//import com.room8.authservice.exception.EmailSendingException;
//import com.room8.authservice.exception.UserNotFoundException;
//import com.room8.authservice.model.Tenant;
//import com.room8.authservice.model.User;
//import com.room8.authservice.model.UserRole;
//import com.room8.authservice.redis.EmailVerificationRedisService;
//import com.room8.authservice.redis.OTPRedisService;
//import com.room8.authservice.redis.RefreshTokenRedisService;
//import com.room8.authservice.redis.UserRedisService;
//import com.room8.authservice.utils.EmailUtils;
//import com.room8.authservice.utils.RoleUtil;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.*;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(SpringExtension.class)
//class UserRegistrationServiceTest {
//
//    @InjectMocks
//    private UserRegistrationService userRegistrationService;
//
//    @Mock
//    private PasswordEncoder passwordEncoder;
//    @Mock
//    private JwtService jwtService;
//    @Mock
//    private UserServiceClient userServiceClient;
//    @Mock
//    private RefreshTokenRedisService refreshTokenRedisService;
//    @Mock
//    private UserRedisService userRedisService;
//    @Mock
//    private EmailVerificationRedisService emailVerificationRedisService;
//    @Mock
//    private OTPRedisService otpRedisService;
//    @Mock
//    private ContactServiceClient contactServiceClient;
//    @Mock
//    private EmailUtils emailUtils;
//    @Mock
//    private RoleUtil roleUtil;
//
//    private RegisterRequest registerRequest;
//    private User tenant;
//    private List<UserRole> userRoles;
//
//    @BeforeEach
//    void setUp() {
//        registerRequest = RegisterRequest.builder()
//                .firstName("John")
//                .lastName("Doe")
//                .email("john.doe@example.com")
//                .password("password123")
//                .phoneNumber("1234567890")
//                .otp("123456")
//                .build();
//
//        UserRole userRole = new UserRole();
//        userRole.setUserAuthority(UserAuthority.TENANT);
//        userRoles = List.of(userRole);
//
//        tenant = Tenant.builder()
//                .firstName("John")
//                .lastName("Doe")
//                .email("john.doe@example.com")
//                .password("encodedPassword")
//                .phoneNumber("1234567890")
//                .isEmailVerified(false)
//                .isPhoneVerified(false)
//                .role(userRoles)
//                .build();
//    }
//
//    @Test
//    void testRegisterUser_Success() {
//        // Arrange
//        doNothing().when(emailUtils).checkUserConflict(registerRequest.getEmail(), registerRequest.getPhoneNumber());
//        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
//        when(roleUtil.generateRole(UserAuthority.TENANT)).thenReturn(userRoles);
//        when(userServiceClient.addUser(Mockito.any())).thenReturn(ResponseEntity.ok(tenant));
//        when(roleUtil.getRoleList(userRoles)).thenReturn(List.of("TENANT"));
//        when(jwtService.generateTokenWithRoles(eq(tenant.getEmail()), eq(List.of("TENANT")), anyLong())).thenReturn("jwtToken");
//        when(jwtService.generateJwtToken(eq(tenant.getEmail()), anyLong())).thenReturn("emailToken");
//        when(contactServiceClient.sendVerificationEmail(any(VerificationRequest.class))).thenReturn(ResponseEntity.ok(true));
//
//        // Act
//        AuthenticationResponse response = userRegistrationService.registerUser(registerRequest, UserAuthority.TENANT);
//
//        // Assert
//        assertNotNull(response);
//        assertEquals("jwtToken", response.getToken());
//        assertNotNull(response.getRefreshToken());
//
//        verify(userRedisService).storeUserInformation(eq(tenant.getEmail()), eq(tenant), eq(60 * 5L));
//        verify(refreshTokenRedisService).storeRefreshToken(eq(tenant.getEmail()), anyString(), eq(60 * 24L));
//        verify(emailVerificationRedisService).storeEmailToken(eq(tenant.getEmail()), eq("emailToken"), eq(30L));
//        verify(otpRedisService).storeOTP(eq(registerRequest.getPhoneNumber()), eq(registerRequest.getOtp()), eq(30L));
//    }
//
//    @Test
//    void testRegisterUser_DuplicateEmail() {
//        // Arrange
//        doThrow(new DuplicateEmailException("Email already in use"))
//                .when(emailUtils).checkUserConflict(registerRequest.getEmail(), registerRequest.getPhoneNumber());
//
//        // Act & Assert
//        DuplicateEmailException exception = assertThrows(DuplicateEmailException.class, () ->
//                userRegistrationService.registerUser(registerRequest, UserAuthority.TENANT));
//
//        assertEquals("Email already in use", exception.getMessage());
//    }
//
//    @Test
//    void testRegisterUser_EmailSendingFailure() {
//        // Arrange
//        doNothing().when(emailUtils).checkUserConflict(registerRequest.getEmail(), registerRequest.getPhoneNumber());
//        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
//        when(roleUtil.generateRole(UserAuthority.TENANT)).thenReturn(userRoles);
//        when(userServiceClient.addUser(Mockito.any())).thenReturn(ResponseEntity.ok(tenant));
//        when(roleUtil.getRoleList(userRoles)).thenReturn(List.of("TENANT"));
//        when(jwtService.generateTokenWithRoles(eq(tenant.getEmail()), eq(List.of("TENANT")), anyLong())).thenReturn("jwtToken");
//        when(jwtService.generateJwtToken(eq(tenant.getEmail()), anyLong())).thenReturn("emailToken");
//        when(contactServiceClient.sendVerificationEmail(any(VerificationRequest.class))).thenReturn(ResponseEntity.ok(false));
//
//        // Act & Assert
//        EmailSendingException exception = assertThrows(EmailSendingException.class, () ->
//                userRegistrationService.registerUser(registerRequest, UserAuthority.TENANT));
//
//        assertEquals("Failed to send verification email", exception.getMessage());
//    }
//
//    @Test
//    void testRegisterUser_NullEmailAndPhone() {
//        // Arrange
//        registerRequest.setEmail(null);
//        registerRequest.setPhoneNumber(null);
//
//        doThrow(new DuplicateEmailException("Email: null already in use"))
//                .when(emailUtils).checkUserConflict(null, null);
//
//        // Act & Assert
//        DuplicateEmailException exception = assertThrows(DuplicateEmailException.class, () ->
//                userRegistrationService.registerUser(registerRequest, UserAuthority.TENANT));
//
//        assertEquals("Email: null already in use", exception.getMessage());
//    }
//}
