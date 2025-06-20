package com.room8.userservice.service;

import com.room8.userservice.client.AuthenticationServiceClient;
import com.room8.userservice.dto.UserDTO;
import com.room8.userservice.dto.UserInfoDTO;
import com.room8.userservice.enums.UserAuthority;
import com.room8.userservice.exception.*;
import com.room8.userservice.model.User;
import com.room8.userservice.model.UserInfo;
import com.room8.userservice.model.UserRole;
import com.room8.userservice.repository.UserInfoRepository;
import com.room8.userservice.repository.UserRepository;
import com.room8.userservice.repository.UserRoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock private UserRepository userRepository;
    @Mock private UserMapperService userMapperService;
    @Mock private AuthenticationServiceClient authenticationServiceClient;
    @Mock private UserInfoMapperService userInfoMapperService;
    @Mock private UserInfoRepository userInfoRepository;
    @Mock private UserRoleRepository userRoleRepository;

    private User mockUser;
    private UserDTO mockUserDTO;
    private UserRole mockRole;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("test@example.com")
                .phoneNumber("1234567890")
                .password("password")
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .role(List.of(UserRole.builder().userAuthority(UserAuthority.TENANT).build()))
                .build();

        mockUserDTO = UserDTO.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("test@example.com")
                .phoneNumber("1234567890")
                .build();

        mockRole = UserRole.builder().userAuthority(UserAuthority.TENANT).build();
    }

    // ----- addUser -----
    @Test
    void addUser_shouldSaveUser() {
        when(userRepository.save(mockUser)).thenReturn(mockUser);
        User savedUser = userService.addUser(mockUser);
        assertEquals(mockUser, savedUser);
    }

    // ----- getUserById -----
    @Test
    void getUserById_shouldReturnDTO() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(userMapperService.toDTO(mockUser)).thenReturn(mockUserDTO);
        UserDTO result = userService.getUserById(1L);
        assertEquals(mockUserDTO, result);
    }

    @Test
    void getUserById_shouldThrowIfNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> userService.getUserById(1L));
    }

    // ----- getUserByEmail -----
    @Test
    void getUserByEmail_shouldReturnUser() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        assertEquals(mockUser, userService.getUserByEmail("test@example.com"));
    }

    @Test
    void getUserByEmail_shouldThrowIfNotFound() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> userService.getUserByEmail("test@example.com"));
    }

    // ----- getUserByPhoneNumber -----
    @Test
    void getUserByPhone_shouldReturnUser() {
        when(userRepository.findByPhoneNumber("1234567890")).thenReturn(Optional.of(mockUser));
        assertEquals(mockUser, userService.getUserByPhoneNumber("1234567890"));
    }

    @Test
    void getUserByPhone_shouldThrowIfNotFound() {
        when(userRepository.findByPhoneNumber("1234567890")).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> userService.getUserByPhoneNumber("1234567890"));
    }

    // ----- getUserIdByEmail -----
    @Test
    void getUserIdByEmail_shouldReturnId() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        assertEquals(1L, userService.getUserIdByEmail("test@example.com"));
    }

    // ----- getUserInfo -----
    @Test
    void getUserInfo_shouldReturnUserInfoDTO_forSelfAccess() {
        when(authenticationServiceClient.getUserEmailFromToken("token")).thenReturn(ResponseEntity.ok("test@example.com"));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(userInfoRepository.findByUser(mockUser)).thenReturn(Optional.of(mock(UserInfo.class)));
        when(userInfoMapperService.toDTO(any())).thenReturn(mock(UserInfoDTO.class));

        assertNotNull(userService.getUserInfo("token", 1L));
    }

    @Test
    void getUserInfo_shouldThrowIfUnauthorized() {
        User anotherUser = User.builder().id(2L).email("other@example.com").role(List.of()).build();

        when(authenticationServiceClient.getUserEmailFromToken("token")).thenReturn(ResponseEntity.ok("test@example.com"));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(userRepository.findById(2L)).thenReturn(Optional.of(anotherUser));

        assertThrows(UserNotAuthorizedException.class, () -> userService.getUserInfo("token", 2L));
    }

    @Test
    void getUserInfo_shouldThrowIfUserInfoMissing() {
        when(authenticationServiceClient.getUserEmailFromToken("token")).thenReturn(ResponseEntity.ok("test@example.com"));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(userInfoRepository.findByUser(mockUser)).thenReturn(Optional.empty());

        assertThrows(UserInfoNotFoundException.class, () -> userService.getUserInfo("token", 1L));
    }

    // ----- updateUser -----
    @Test
    void updateUser_shouldUpdateAndReturnDTO() {
        // Arrange - change something in the DTO
        mockUserDTO.setFirstName("UpdatedName"); // DIFFERENT from mockUser's first name

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(userMapperService.toDTO(any())).thenReturn(mockUserDTO);
        when(userRepository.save(any())).thenReturn(mockUser);

        doAnswer(invocation -> {
            UserDTO dto = invocation.getArgument(0);
            User user = invocation.getArgument(1);
            user.setFirstName(dto.getFirstName()); // apply the change
            return null;
        }).when(userMapperService).updateEntity(any(), any());

        // Act
        UserDTO result = userService.updateUser(mockUserDTO);

        // Assert
        assertEquals(mockUserDTO, result);
    }


    @Test
    void updateUser_shouldThrowIfNoChange() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        doNothing().when(userMapperService).updateEntity(mockUserDTO, mockUser);
        assertThrows(NoUpdateNeededException.class, () -> userService.updateUser(mockUserDTO));
    }

    @Test
    void updateUser_shouldThrowIfInvalidRequest() {
        UserDTO badDTO = new UserDTO();
        assertThrows(BadRequestException.class, () -> userService.updateUser(badDTO));
    }

    // ----- markUserAsEmailVerified -----
    @Test
    void markUserAsEmailVerified_shouldUpdate() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        userService.markUserAsEmailVerified("test@example.com");
        assertTrue(mockUser.getIsEmailVerified());
    }

    @Test
    void markUserAsEmailVerified_shouldSkipIfAlreadyVerified() {
        mockUser.setIsEmailVerified(true);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        User result = userService.markUserAsEmailVerified("test@example.com");
        assertTrue(result.getIsEmailVerified());
    }

    // ----- markUserAsPhoneVerified -----
    @Test
    void markUserAsPhoneVerified_shouldUpdate() {
        when(userRepository.findByPhoneNumber("1234567890")).thenReturn(Optional.of(mockUser));
        userService.markUserAsPhoneVerified("1234567890");
        assertTrue(mockUser.getIsPhoneVerified());
    }

    // ----- getRole -----
    @Test
    void getRole_shouldReturnExistingRole() {
        when(userRoleRepository.findByUserAuthority(UserAuthority.TENANT)).thenReturn(Optional.of(mockRole));
        UserRole result = userService.getRole(UserAuthority.TENANT);
        assertEquals(mockRole, result);
    }

    @Test
    void getRole_shouldCreateIfNotFound() {
        when(userRoleRepository.findByUserAuthority(UserAuthority.TENANT)).thenReturn(Optional.empty());
        when(userRoleRepository.save(any())).thenReturn(mockRole);
        UserRole result = userService.getRole(UserAuthority.TENANT);
        assertEquals(mockRole, result);
    }
}
