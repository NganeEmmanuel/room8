package com.room8.roomservice.service.impl;

import com.room8.roomservice.dto.*;
import com.room8.roomservice.exception.InvalidRequestException;
import com.room8.roomservice.exception.NotFoundException;
import com.room8.roomservice.messaging.ListingEventPublisher;
import com.room8.roomservice.model.Apartment;
import com.room8.roomservice.model.SingleRoom;
import com.room8.roomservice.model.Studio;
import com.room8.roomservice.repository.ApartmentRepository;
import com.room8.roomservice.repository.SingleRoomRepository;
import com.room8.roomservice.repository.StudioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoomServiceImplTest {

    @Mock private SingleRoomMapper singleRoomMapper;
    @Mock private StudioMapper studioMapper;
    @Mock private ApartmentMapper apartmentMapper;
    @Mock private SingleRoomRepository singleRoomRepository;
    @Mock private StudioRepository studioRepository;
    @Mock private ApartmentRepository apartmentRepository;
    @Mock private ListingEventPublisher listingEventPublisher;

    @InjectMocks private RoomServiceImpl roomService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        roomService = new RoomServiceImpl(
                singleRoomMapper, studioMapper, apartmentMapper,
                singleRoomRepository, studioRepository, apartmentRepository,
                listingEventPublisher
        );
    }

    @Nested
    @DisplayName("addRoom() tests")
    class AddRoomTests {
        @Test
        void testAddRoom_HappyPath_Studio() {
            ListingDTO inputDto = new ListingDTO();
            inputDto.setListingType("Studio");
            inputDto.setLandlordId(1L);
            inputDto.setListingCity("Lagos");

            StudioDTO returnedDto = new StudioDTO();
            returnedDto.setListingType("Studio");
            returnedDto.setLandlordId(1L);
            returnedDto.setListingCity("Lagos");
            returnedDto.setHasLivingRoom(true);

            Studio studioEntity = new Studio();

            when(studioMapper.toEntity(any())).thenReturn(studioEntity);
            when(studioRepository.save(any())).thenReturn(studioEntity);
            when(studioMapper.toDTO(any())).thenReturn(returnedDto);

            ListingDTO result = roomService.addRoom(inputDto);

            assertInstanceOf(StudioDTO.class, result);
            StudioDTO resultStudio = (StudioDTO) result;

            assertEquals("Studio", resultStudio.getListingType());
            assertEquals(1L, resultStudio.getLandlordId());
            assertEquals("Lagos", resultStudio.getListingCity());
            assertTrue(resultStudio.getHasLivingRoom());

            verify(listingEventPublisher).publishListingEvent(returnedDto, "CREATE");
        }

        @Test
        void testAddRoom_HappyPath_SingleRoom() {
            ListingDTO inputDto = new ListingDTO();
            inputDto.setListingType("SingleRoom");
            inputDto.setLandlordId(2L);
            inputDto.setListingCity("Abuja");

            SingleRoomDTO returnedDto = new SingleRoomDTO();
            returnedDto.setListingType("SingleRoom");
            returnedDto.setLandlordId(2L);
            returnedDto.setListingCity("Abuja");

            SingleRoom entity = new SingleRoom();

            when(singleRoomMapper.toEntity(any())).thenReturn(entity);
            when(singleRoomRepository.save(any())).thenReturn(entity);
            when(singleRoomMapper.toDTO(any())).thenReturn(returnedDto);

            ListingDTO result = roomService.addRoom(inputDto);

            assertInstanceOf(SingleRoomDTO.class, result);
            SingleRoomDTO resultDto = (SingleRoomDTO) result;

            assertEquals("SingleRoom", resultDto.getListingType());
            assertEquals(2L, resultDto.getLandlordId());
            assertEquals("Abuja", resultDto.getListingCity());

            verify(listingEventPublisher).publishListingEvent(returnedDto, "CREATE");
        }

        @Test
        void testAddRoom_HappyPath_Apartment() {
            ListingDTO inputDto = new ListingDTO();
            inputDto.setListingType("Apartment");
            inputDto.setLandlordId(3L);
            inputDto.setListingCity("Ibadan");

            ApartmentDTO returnedDto = new ApartmentDTO();
            returnedDto.setListingType("Apartment");
            returnedDto.setLandlordId(3L);
            returnedDto.setListingCity("Ibadan");
            returnedDto.setHasLivingRoom(true);
            returnedDto.setHasOutDoorLivingArea(true);
            returnedDto.setOutDoorArea(20.0);

            Apartment entity = new Apartment();

            when(apartmentMapper.toEntity(any())).thenReturn(entity);
            when(apartmentRepository.save(any())).thenReturn(entity);
            when(apartmentMapper.toDTO(any())).thenReturn(returnedDto);

            ListingDTO result = roomService.addRoom(inputDto);

            assertInstanceOf(ApartmentDTO.class, result);
            ApartmentDTO resultDto = (ApartmentDTO) result;

            assertEquals("Apartment", resultDto.getListingType());
            assertEquals(3L, resultDto.getLandlordId());
            assertEquals("Ibadan", resultDto.getListingCity());
            assertTrue(resultDto.getHasLivingRoom());
            assertTrue(resultDto.getHasOutDoorLivingArea());
            assertEquals(20.0, resultDto.getOutDoorArea());

            verify(listingEventPublisher).publishListingEvent(returnedDto, "CREATE");
        }

        // ❌ Unhappy Path: ListingDTO is null
        @Test
        void testAddRoom_UnhappyPath_NullDTO() {
            assertThrows(InvalidRequestException.class, () -> roomService.addRoom(null));
        }

        // ❌ Unhappy Path: ListingType is null
        @Test
        void testAddRoom_UnhappyPath_NullListingType() {
            ListingDTO dto = new ListingDTO();
            dto.setListingType(null); // or omit

            assertThrows(InvalidRequestException.class, () -> roomService.addRoom(dto));
        }

        // ❌ Unhappy Path: ListingType is empty
        @Test
        void testAddRoom_UnhappyPath_EmptyListingType() {
            ListingDTO dto = new ListingDTO();
            dto.setListingType("");

            assertThrows(InvalidRequestException.class, () -> roomService.addRoom(dto));
        }

        // ⚠️ Edge Case: ListingType not matching any known type
        @Test
        void testAddRoom_EdgeCase_InvalidType() {
            ListingDTO dto = new ListingDTO();
            dto.setListingType("TreeHouse");

            assertThrows(InvalidRequestException.class, () -> roomService.addRoom(dto));
        }

    }

    @Nested
    @DisplayName("getRoom() tests")
    class GetRoomTests {

        @Test
        void testGetRoom_HappyPath_SingleRoom() {
            ListingRequest request = new ListingRequest(1L, "SingleRoom");
            SingleRoom room = new SingleRoom();
            SingleRoomDTO dto = new SingleRoomDTO();
            when(singleRoomRepository.findById(1L)).thenReturn(Optional.of(room));
            when(singleRoomMapper.toDTO(room)).thenReturn(dto);

            ListingDTO result = roomService.getRoom(request);

            assertEquals(dto, result);
        }

        @Test
        void testGetRoom_HappyPath_Studio() {
            ListingRequest request = new ListingRequest(2L, "Studio");
            Studio studio = new Studio();
            StudioDTO dto = new StudioDTO();
            when(studioRepository.findById(2L)).thenReturn(Optional.of(studio));
            when(studioMapper.toDTO(studio)).thenReturn(dto);

            ListingDTO result = roomService.getRoom(request);

            assertEquals(dto, result);
        }

        @Test
        void testGetRoom_HappyPath_Apartment() {
            ListingRequest request = new ListingRequest(3L, "Apartment");
            Apartment apartment = new Apartment();
            ApartmentDTO dto = new ApartmentDTO();
            when(apartmentRepository.findById(3L)).thenReturn(Optional.of(apartment));
            when(apartmentMapper.toDTO(apartment)).thenReturn(dto);

            ListingDTO result = roomService.getRoom(request);

            assertEquals(dto, result);
        }

        @Test
        void testGetRoom_UnhappyPath_NotFound() {
            ListingRequest request = new ListingRequest(99L, "Studio");
            when(studioRepository.findById(99L)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> roomService.getRoom(request));
        }

        @Test
        void testGetRoom_EdgeCase_InvalidType() {
            ListingRequest request = new ListingRequest(1L, "InvalidType");

            assertThrows(InvalidRequestException.class, () -> roomService.getRoom(request));
        }
    }

    @Nested
    @DisplayName("updateRoom() tests")
    class UpdateRoomTests {

        @Test
        void testUpdateRoom_HappyPath() {
            ListingDTO dto = new ListingDTO();
            dto.setId(1L);
            dto.setListingType("Studio");

            Studio studio = new Studio();
            StudioDTO savedDTO = new StudioDTO();

            when(studioRepository.findById(1L)).thenReturn(Optional.of(studio));
            when(studioRepository.save(any())).thenReturn(studio);
            when(studioMapper.toDTO(any())).thenReturn(savedDTO);
            when(studioMapper.toEntity(any())).thenReturn(studio);

            ListingDTO result = roomService.updateRoom(dto);

            assertEquals(savedDTO, result);
            verify(listingEventPublisher).publishListingEvent(savedDTO, "UPDATE");
        }

        @Test
        void testUpdateRoom_UnhappyPath_NotFound() {
            ListingDTO dto = new ListingDTO();
            dto.setId(999L);
            dto.setListingType("SingleRoom");

            when(singleRoomRepository.findById(999L)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> roomService.updateRoom(dto));
        }

        @Test
        void testUpdateRoom_EdgeCase_InvalidType() {
            ListingDTO dto = new ListingDTO();
            dto.setId(1L);
            dto.setListingType("TreeHouse");

            assertThrows(InvalidRequestException.class, () -> roomService.updateRoom(dto));
        }
    }

    @Nested
    @DisplayName("deleteRoom() tests")
    class DeleteRoomTests {

        @Test
        void testDeleteRoom_HappyPath() {
            ListingRequest request = new ListingRequest(1L, "Studio");
            Studio studio = new Studio();
            StudioDTO dto = new StudioDTO();

            when(studioRepository.findById(1L)).thenReturn(Optional.of(studio));
            when(studioMapper.toDTO(studio)).thenReturn(dto);

            roomService.deleteRoom(request);

            verify(studioRepository).deleteById(1L);
            verify(listingEventPublisher).publishListingEvent(dto, "DELETE");
        }

        @Test
        void testDeleteRoom_UnhappyPath_NotFound() {
            ListingRequest request = new ListingRequest(99L, "Apartment");

            when(apartmentRepository.findById(99L)).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> roomService.deleteRoom(request));
        }

        @Test
        void testDeleteRoom_EdgeCase_InvalidType() {
            ListingRequest request = new ListingRequest(1L, "Igloo");

            assertThrows(InvalidRequestException.class, () -> roomService.deleteRoom(request));
        }
    }

    @Nested
    @DisplayName("deleteAllRoomsByUserID() tests")
    class DeleteAllRoomsByUserIDTests {

        @Test
        void testDeleteAllRoomsByUserID_HappyPath() {
            Long userId = 1L;
            List<Long> singleIds = List.of(1L, 2L);
            List<Long> studioIds = List.of(3L);
            List<Long> apartmentIds = List.of(4L, 5L);

            when(singleRoomRepository.findIdsByLandlordId(userId)).thenReturn(singleIds);
            when(studioRepository.findIdsByLandlordId(userId)).thenReturn(studioIds);
            when(apartmentRepository.findIdsByLandlordId(userId)).thenReturn(apartmentIds);

            roomService.deleteAllRoomsByUserID(userId);

            verify(singleRoomRepository).deleteAllByLandlordId(userId);
            verify(studioRepository).deleteAllByLandlordId(userId);
            verify(apartmentRepository).deleteAllByLandlordId(userId);

            verify(listingEventPublisher).publishBulkDeleteEvent(List.of(1L, 2L, 3L, 4L, 5L));
        }

        @Test
        void testDeleteAllRoomsByUserID_EdgeCase_NoRooms() {
            Long userId = 2L;

            when(singleRoomRepository.findIdsByLandlordId(userId)).thenReturn(List.of());
            when(studioRepository.findIdsByLandlordId(userId)).thenReturn(List.of());
            when(apartmentRepository.findIdsByLandlordId(userId)).thenReturn(List.of());

            roomService.deleteAllRoomsByUserID(userId);

            verify(singleRoomRepository).deleteAllByLandlordId(userId);
            verify(studioRepository).deleteAllByLandlordId(userId);
            verify(apartmentRepository).deleteAllByLandlordId(userId);

            verify(listingEventPublisher).publishBulkDeleteEvent(List.of());
        }
    }


    // More @Nested test classes for:
    // - getRoom()
    // - updateRoom()
    // - deleteRoom()
    // - deleteAllRoomsByUserID()
}
