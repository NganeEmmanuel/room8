package com.room8.roomservice.service.impl;

import com.room8.roomservice.model.Room;
import com.room8.roomservice.model.RoomDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;

import static org.junit.jupiter.api.Assertions.*;

class RoomMapperServiceImplTest {

    private RoomMapperServiceImpl roomMapper;

    private final ModelMapper modelMapper = new ModelMapper();

    @BeforeEach
    void setUp() {
        roomMapper = new RoomMapperServiceImpl(modelMapper);
    }

    @Nested
    @DisplayName("toDTO() tests")
    class ToDtoTests {

        @Test
        @DisplayName("Happy path: maps entity to DTO")
        void testToDtoHappyPath() {
            Room room = new Room();
            room.setId(1L);
            room.setName("Test Room");

            RoomDto dto = roomMapper.toDTO(room);

            assertNotNull(dto);
            assertEquals(room.getId(), dto.getId());
            assertEquals(room.getName(), dto.getName());
        }

        @Test
        @DisplayName("Unhappy path: null entity returns null DTO")
        void testToDtoNullEntity() {
            assertNull(roomMapper.toDTO(null));
        }
    }

    @Nested
    @DisplayName("toEntity() tests")
    class ToEntityTests {

        @Test
        @DisplayName("Happy path: maps DTO to entity")
        void testToEntityHappyPath() {
            RoomDto dto = new RoomDto();
            dto.setId(2L);
            dto.setName("Test DTO");

            Room room = roomMapper.toEntity(dto);

            assertNotNull(room);
            assertEquals(dto.getId(), room.getId());
            assertEquals(dto.getName(), room.getName());
        }

        @Test
        @DisplayName("Unhappy path: null DTO returns null entity")
        void testToEntityNullDto() {
            assertNull(roomMapper.toEntity(null));
        }
    }

    @Nested
    @DisplayName("updateEntity() tests")
    class UpdateEntityTests {

        @Test
        @DisplayName("Happy path: updates entity from DTO")
        void testUpdateEntityHappyPath() {
            RoomDto dto = new RoomDto();
            dto.setId(3L);
            dto.setName("Updated Name");

            Room room = new Room();
            room.setId(3L);
            room.setName("Old Name");

            roomMapper.updateEntity(dto, room);

            assertEquals(dto.getName(), room.getName());
        }

        @Test
        @DisplayName("Edge case: null DTO does not update entity")
        void testUpdateEntityNullDto() {
            Room room = new Room();
            room.setName("Original");

            roomMapper.updateEntity(null, room);

            assertEquals("Original", room.getName());
        }

        @Test
        @DisplayName("Edge case: null entity does nothing")
        void testUpdateEntityNullEntity() {
            RoomDto dto = new RoomDto();
            dto.setName("New Name");

            // Should not throw
            assertDoesNotThrow(() -> roomMapper.updateEntity(dto, null));
        }

        @Test
        @DisplayName("Edge case: both nulls")
        void testUpdateEntityBothNull() {
            assertDoesNotThrow(() -> roomMapper.updateEntity(null, null));
        }
    }
}
