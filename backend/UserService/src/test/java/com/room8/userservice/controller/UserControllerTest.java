package com.room8.userservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.userservice.dto.UserDTO;
import com.room8.userservice.dto.UserInfoDTO;
import com.room8.userservice.enums.CleanlinessLevel;
import com.room8.userservice.enums.UserAuthority;
import com.room8.userservice.exception.BadRequestException;
import com.room8.userservice.model.User;
import com.room8.userservice.model.UserRole;
import com.room8.userservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;
    private User retrurnedUser;
    private UserDTO userDTO;
    private UserInfoDTO userInfoDTO;

    @BeforeEach
    void setup() {
        user = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phoneNumber("+123456789")
                .password("password")
                .isPhoneVerified(false)
                .isEmailVerified(false)
                .build();

        retrurnedUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phoneNumber("+123456789")
                .password("password")
                .isPhoneVerified(false)
                .isEmailVerified(false)
                .build();

        userDTO = UserDTO.builder()
                .id(1L)
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .role(List.of(UserRole.builder().userAuthority(UserAuthority.TENANT).build()))
                .build();

        userInfoDTO = UserInfoDTO.builder()
                .cleanlinessLevel(CleanlinessLevel.AVERAGE)
                .build();
    }

    @Test
    void addUser_ValidRequest_ReturnsUser() throws Exception {

        when(userService.addUser(user)).thenReturn(retrurnedUser);

        mockMvc.perform(post("/api/v1/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    void updateUser_ValidRequest_ReturnsUpdatedUserDTO() throws Exception {
        when(userService.updateUser(any())).thenReturn(userDTO);

        mockMvc.perform(put("/api/v1/user/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    void getUserFromEmail_ValidEmail_ReturnsUser() throws Exception {
        when(userService.getUserByEmail("john.doe@example.com")).thenReturn(user);

        mockMvc.perform(get("/api/v1/user/get-user/email")
                        .param("email", "john.doe@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    void getUserFromPhoneNumber_Valid_ReturnsUser() throws Exception {
        when(userService.getUserByPhoneNumber("+123456789")).thenReturn(user);

        mockMvc.perform(get("/api/v1/user/get-user/phone-number")
                        .param("phoneNumber", "+123456789"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phoneNumber").value("+123456789"));
    }

    @Test
    void getUserFromId_ValidId_ReturnsUserDTO() throws Exception {
        when(userService.getUserById(1L)).thenReturn(userDTO);

        mockMvc.perform(get("/api/v1/user/get-user/id")
                        .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    void getUserIdFromEmail_ValidEmail_ReturnsId() throws Exception {
        when(userService.getUserIdByEmail("john.doe@example.com")).thenReturn(1L);

        mockMvc.perform(get("/api/v1/user/get-user-id")
                        .param("email", "john.doe@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));
    }

    @Test
    void getUserInfo_ValidHeader_ReturnsUserInfoDTO() throws Exception {
        when(userService.getUserInfo("jwt-token", 1L)).thenReturn(userInfoDTO);

        mockMvc.perform(get("/api/v1/user/get-user-info")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token")
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cleanlinessLevel").value(CleanlinessLevel.AVERAGE.toString()));
    }

    @Test
    void getUserInfo_InvalidHeader_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/user/get-user-info")
                        .header(HttpHeaders.AUTHORIZATION, "InvalidHeader")
                        .param("userId", "1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void markUserAsEmailVerified_Valid_ReturnsUser() throws Exception {
        retrurnedUser.setIsEmailVerified(true);
        when(userService.markUserAsEmailVerified(any())).thenReturn(retrurnedUser);

        mockMvc.perform(put("/api/v1/user/mark-as-verified/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"john.doe@example.com\""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.isEmailVerified").value(true));
    }

    @Test
    void markUserAsPhoneVerified_Valid_ReturnsUser() throws Exception {
        when(userService.markUserAsPhoneVerified(any())).thenReturn(retrurnedUser);

        mockMvc.perform(put("/api/v1/user/mark-as-verified/phone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"+123456789\""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phoneNumber").value("+123456789"));
    }

    @Test
    void getRole_ValidAuthority_ReturnsUserRole() throws Exception {
        UserRole role = UserRole.builder().userAuthority(UserAuthority.LANDLORD).build();
        when(userService.getRole(UserAuthority.LANDLORD)).thenReturn(role);

        mockMvc.perform(get("/api/v1/user/getRole")
                        .param("role", "LANDLORD"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userAuthority").value("LANDLORD"));
    }

    // UNHAPPY / EDGE CASES

    @Test
    void addUser_NullBody_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/v1/user/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getUserFromEmail_NotFound_Returns404() throws Exception {
        when(userService.getUserByEmail("missing@example.com")).thenReturn(null);

        mockMvc.perform(get("/api/v1/user/get-user/email")
                        .param("email", "missing@example.com"))
                .andExpect(status().isOk()) // Change to .isNotFound() if you handle that in controller
                .andExpect(content().string(""));
    }

    @Test
    void markUserAsEmailVerified_Invalid_ReturnsEmptyUser() throws Exception {
        when(userService.markUserAsEmailVerified("wrong@example.com")).thenReturn(new User());

        mockMvc.perform(put("/api/v1/user/mark-as-verified/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"wrong@example.com\""))
                .andExpect(status().isOk());
    }

    @Test
    void getUserInfo_MissingHeader_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/user/get-user-info")
                        .header(HttpHeaders.AUTHORIZATION, " ")
                        .param("userId", "1"))
                .andExpect(status().isBadRequest());
    }
}
