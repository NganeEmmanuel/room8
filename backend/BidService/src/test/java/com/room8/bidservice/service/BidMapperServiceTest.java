package com.room8.bidservice.service;


import com.room8.bidservice.feignInterface.UserAuthServiceInterface;
import com.room8.bidservice.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BidMapperServiceTest {

    private UserAuthServiceInterface userAuthService;
    private BidMapperService bidMapperService;

    @BeforeEach
    void setUp() {
        userAuthService = mock(UserAuthServiceInterface.class);
        bidMapperService = new BidMapperService(userAuthService);
    }

    @Test
    void toResponseDTO_shouldMapBidToResponseDTO_whenUserIsFound() {
        // Arrange
        Bid bid = Bid.builder()
                .id(1L)
                .ListingId(100L)
                .bidderId(10L)
                .bidderInfo(new UserInfo())
                .proposal("My proposal")
                .bidDate(new Date())
                .lastUpdated(new Date())
                .build();

        UserDTO userDTO = UserDTO.builder()
                .firstName("John")
                .lastName("Doe")
                .build();

        when(userAuthService.getUserFromId(10L)).thenReturn(ResponseEntity.ok(userDTO));

        // Act
        ResponseBidDTO responseBidDTO = bidMapperService.toResponseDTO(bid);

        // Assert
        assertNotNull(responseBidDTO);
        assertEquals("John Doe", responseBidDTO.getBidderFullName());
        assertEquals(bid.getListingId(), responseBidDTO.getListingId());
        assertEquals(bid.getProposal(), responseBidDTO.getProposal());
        assertEquals(bid.getBidderInfo(), responseBidDTO.getBidderInfo());
        assertEquals(bid.getBidDate(), responseBidDTO.getBidDate());
        assertEquals(bid.getLastUpdated(), responseBidDTO.getLastUpdated());

        verify(userAuthService, times(1)).getUserFromId(10L);
    }

    @Test
    void toResponseDTO_shouldThrowRuntimeException_whenUserServiceFails() {
        // Arrange
        Bid bid = Bid.builder()
                .id(1L)
                .ListingId(100L)
                .bidderId(10L)
                .build();

        when(userAuthService.getUserFromId(10L)).thenThrow(new RuntimeException("Service down"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bidMapperService.toResponseDTO(bid);
        });

        assertEquals("Service down", exception.getCause().getMessage());
        verify(userAuthService, times(1)).getUserFromId(10L);
    }

    @Test
    void toResponseDTO_shouldThrowRuntimeException_whenUserDTOIsNull() {
        // Arrange
        Bid bid = Bid.builder()
                .id(1L)
                .ListingId(100L)
                .bidderId(10L)
                .build();

        when(userAuthService.getUserFromId(10L)).thenReturn(ResponseEntity.ok(null));

        // Act & Assert
        AssertionError error = assertThrows(AssertionError.class, () -> {
            bidMapperService.toResponseDTO(bid);
        });

        verify(userAuthService, times(1)).getUserFromId(10L);
    }

    @Test
    void requestDTOToEntity_shouldMapRequestDTOToBidEntity() {
        // Arrange
        RequestBidDTO dto = RequestBidDTO.builder()
                .ListingId(123L)
                .bidderId(456L)
                .proposal("Test proposal")
                .build();

        // Act
        Bid bid = bidMapperService.requestDTOToEntity(dto);

        // Assert
        assertNotNull(bid);
        assertEquals(dto.getListingId(), bid.getListingId());
        assertEquals(dto.getBidderId(), bid.getBidderId());
        assertEquals(dto.getProposal(), bid.getProposal());
        assertNull(bid.getBidDate()); // since not set
        assertNull(bid.getLastUpdated()); // since not set
    }

    @Test
    void updateEntity_shouldUpdateProposalAndLastUpdatedDate() {
        // Arrange
        RequestBidDTO dto = RequestBidDTO.builder()
                .proposal("Updated proposal")
                .build();

        Bid bid = Bid.builder()
                .proposal("Old proposal")
                .lastUpdated(null)
                .build();

        // Act
        bidMapperService.updateEntity(dto, bid);

        // Assert
        assertEquals("Updated proposal", bid.getProposal());
        assertNotNull(bid.getLastUpdated());
        assertTrue(bid.getLastUpdated().before(new Date(System.currentTimeMillis() + 1000))); // rough check
    }


}
