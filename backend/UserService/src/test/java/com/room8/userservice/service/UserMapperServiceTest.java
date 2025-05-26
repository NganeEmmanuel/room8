package com.room8.userservice.service;

import com.room8.userservice.model.User;
import com.room8.userservice.model.UserDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Unit tests for the {@link UserMapperService}.
 * This test verifies the correct mapping between {@link User} and {@link UserDTO}
 * in both directions and the update of existing entity objects.
 */
class UserMapperServiceTest {

    private UserMapperService userMapperService;

    @BeforeEach
    void setUp() {
        userMapperService = new UserMapperService();
    }

    /**
     * Test conversion from User entity to UserDTO.
     */
    @Test
    void testToDTO() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setPhoneNumber("1234567890");

        // Act
        UserDTO userDTO = userMapperService.toDTO(user);

        // Assert
        assertNotNull(userDTO);
        assertEquals(user.getId(), userDTO.getId());
        assertEquals(user.getFirstName(), userDTO.getFirstName());
        assertEquals(user.getLastName(), userDTO.getLastName());
        assertEquals(user.getEmail(), userDTO.getEmail());
        assertEquals(user.getPhoneNumber(), userDTO.getPhoneNumber());
    }

    /**
     * Test conversion from UserDTO to User entity.
     */
    @Test
    void testToEntity() {
        // Arrange
        UserDTO dto = new UserDTO();
        dto.setId(2L);
        dto.setFirstName("Jane");
        dto.setLastName("Smith");
        dto.setEmail("jane.smith@example.com");
        dto.setPhoneNumber("0987654321");

        // Act
        User user = userMapperService.toEntity(dto);

        // Assert
        assertNotNull(user);
        assertEquals(dto.getId(), user.getId());
        assertEquals(dto.getFirstName(), user.getFirstName());
        assertEquals(dto.getLastName(), user.getLastName());
        assertEquals(dto.getEmail(), user.getEmail());
        assertEquals(dto.getPhoneNumber(), user.getPhoneNumber());
    }

    /**
     * Test updating an existing User entity with values from a UserDTO.
     */
    @Test
    void testUpdateEntity() {
        // Arrange
        UserDTO dto = new UserDTO();
        dto.setFirstName("Updated");
        dto.setLastName("Name");
        dto.setEmail("updated@example.com");

        User user = new User();
        user.setFirstName("Old");
        user.setLastName("Name");
        user.setEmail("old@example.com");

        // Act
        userMapperService.updateEntity(dto, user);

        // Assert
        assertEquals(dto.getFirstName(), user.getFirstName());
        assertEquals(dto.getLastName(), user.getLastName());
        assertEquals(dto.getEmail(), user.getEmail());
    }
}
