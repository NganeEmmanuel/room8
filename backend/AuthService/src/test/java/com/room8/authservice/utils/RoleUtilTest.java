package com.room8.authservice.utils;

import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.exception.UserNotFoundException;
import com.room8.authservice.model.UserRole;
import com.room8.authservice.redis.UserRoleRedisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link RoleUtil} class.
 */
@ExtendWith(MockitoExtension.class)
class RoleUtilTest {

    @Mock
    private UserRoleRedisService userRoleRedisService;

    @Mock
    private UserServiceClient userServiceClient;

    @InjectMocks
    private RoleUtil roleUtil;

    private UserRole userRole;
    private UserAuthority userAuthority;

    @BeforeEach
    void setUp() {
        userRole = new UserRole();
        userRole.setUserAuthority(UserAuthority.TENANT); // Assuming there’s a setter for userAuthority
        userAuthority = UserAuthority.TENANT;
    }

    @Test
    void testGetRoleList() {
        // Arrange
        List<UserRole> roles = List.of(userRole);

        // Act
        List<String> roleList = roleUtil.getRoleList(roles);

        // Assert
        assertEquals(1, roleList.size());
        assertEquals("TENANT", roleList.getFirst()); // Assuming the authority is converted to string as "TENANT"
    }

    @Test
    void testGenerateRole_roleExistsInCache() {
        // Arrange
        when(userRoleRedisService.getUserRole(userAuthority.toString())).thenReturn(userRole);

        // Act
        List<UserRole> roles = roleUtil.generateRole(userAuthority);

        // Assert
        assertEquals(1, roles.size());
        assertEquals(userRole, roles.getFirst());
        verify(userServiceClient, never()).getRole(userAuthority); // Ensure no call to user service
        verify(userRoleRedisService, never()).storeUserRole(anyString(), any(), anyLong()); // Ensure no caching
    }

    @Test
    void testGenerateRole_roleDoesNotExistInCache() {
        // Arrange
        when(userRoleRedisService.getUserRole(userAuthority.toString())).thenReturn(null);
        when(userServiceClient.getRole(userAuthority)).thenReturn(ResponseEntity.ok(userRole));

        // Act
        List<UserRole> roles = roleUtil.generateRole(userAuthority);

        // Assert
        assertEquals(1, roles.size());
        assertEquals(userRole, roles.getFirst());
        verify(userServiceClient).getRole(userAuthority); // Ensure call to user service
        verify(userRoleRedisService).storeUserRole(userAuthority.toString(), userRole, 60 * 24); // Ensure caching
    }

    @Test
    void testGenerateRole_userServiceThrowsException() {
        // Arrange
        when(userRoleRedisService.getUserRole(userAuthority.toString())).thenReturn(null);
        when(userServiceClient.getRole(userAuthority)).thenThrow(new UserNotFoundException("User not found"));

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> roleUtil.generateRole(userAuthority));
    }

    @Test
    void testGenerateRole_roleIsNull() {
        // Arrange
        when(userRoleRedisService.getUserRole(userAuthority.toString())).thenReturn(null);
        when(userServiceClient.getRole(userAuthority)).thenReturn(ResponseEntity.ok(null));

        // Act & Assert
        assertThrows(NullPointerException.class, () -> roleUtil.generateRole(userAuthority));
    }
}