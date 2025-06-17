package com.room8.roomservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.roomservice.dto.ListingDTO;
import com.room8.roomservice.dto.ListingRequest;
import com.room8.roomservice.exception.InvalidRequestException;
import com.room8.roomservice.service.RoomService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoomService roomService;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    class AddRoomTests {
        @Test
        void testAddRoom_HappyPath() throws Exception {
            ListingDTO request = new ListingDTO();
            request.setListingType("SingleRoom");
            request.setId(1L);

            ListingDTO response = new ListingDTO();
            response.setId(1L);

            when(roomService.addRoom(any(ListingDTO.class))).thenReturn(response);

            mockMvc.perform(post("/api/v1/listings/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(1L));
        }

        @Test
        void testAddRoom_UnhappyPath_InvalidInput() throws Exception {
            ListingDTO request = new ListingDTO(); // no type set

            Mockito.doThrow(new InvalidRequestException("Listing type is required"))
                    .when(roomService).addRoom(any(ListingDTO.class));

            mockMvc.perform(post("/api/v1/listings/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest()); // expecting service to throw
        }
    }

    @Nested
    class GetRoomTests {
        @Test
        void testGetRoom_HappyPath() throws Exception {
            ListingRequest request = new ListingRequest();
            request.setRoomId(2L);

            ListingDTO response = new ListingDTO();
            response.setId(2L);

            when(roomService.getRoom(any(ListingRequest.class))).thenReturn(response);

            mockMvc.perform(get("/api/v1/listings/get/listing")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(2L));
        }

        @Test
        void testGetRoom_UnhappyPath_MissingId() throws Exception {
            ListingRequest request = new ListingRequest(); // no ID

            Mockito.doThrow(new InvalidRequestException("Listing ID is required"))
                    .when(roomService).getRoom(any(ListingRequest.class));

            mockMvc.perform(get("/api/v1/listings/get/listing")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    class UpdateRoomTests {
        @Test
        void testUpdateRoom_HappyPath() throws Exception {
            ListingDTO request = new ListingDTO();
            request.setId(3L);
            request.setListingType("Studio");

            when(roomService.updateRoom(any(ListingDTO.class))).thenReturn(request);

            mockMvc.perform(put("/api/v1/listings/update/listing")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(3L));
        }

        @Test
        void testUpdateRoom_UnhappyPath_InvalidData() throws Exception {
            ListingDTO request = new ListingDTO(); // missing ID/type

            Mockito.doThrow(new InvalidRequestException("Listing ID and types are required"))
                    .when(roomService).updateRoom(any(ListingDTO.class));

            mockMvc.perform(put("/api/v1/listings/update/listing")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    class DeleteRoomTests {
        @Test
        void testDeleteRoom_HappyPath() throws Exception {
            ListingRequest request = new ListingRequest();
            request.setRoomId(4L);

            doNothing().when(roomService).deleteRoom(any(ListingRequest.class));

            mockMvc.perform(delete("/api/v1/listings/delete/listing")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNoContent());
        }

        @Test
        void testDeleteRoom_UnhappyPath_MissingId() throws Exception {
            ListingRequest request = new ListingRequest(); // missing ID

            Mockito.doThrow(new InvalidRequestException("Listing ID is required"))
                    .when(roomService).deleteRoom(any(ListingRequest.class));

            mockMvc.perform(delete("/api/v1/listings/delete/listing")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest()); // or is4xxClientError
        }

    }

    @Nested
    class DeleteAllByUserTests {
        @Test
        void testDeleteAllByUser_HappyPath() throws Exception {
            doNothing().when(roomService).deleteAllRoomsByUserID(99L);

            mockMvc.perform(delete("/api/v1/listings/delete-all-by-userId")
                            .param("userID", "99"))
                    .andExpect(status().isNoContent());
        }

        @Test
        void testDeleteAllByUser_EdgeCase_MissingParam() throws Exception {
            mockMvc.perform(delete("/api/v1/listings/delete-all-by-userId"))
                    .andExpect(status().is5xxServerError());
        }

    }
}
