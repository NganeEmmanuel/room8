package com.room8.userservice.service;

import com.room8.userservice.enums.*;
import com.room8.userservice.model.UserInfo;
import com.room8.userservice.model.UserInfoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserInfoMapperServiceTest {

    private UserInfoMapperService userInfoMapperService;

    private UserInfo userInfo;
    private UserInfoDTO userInfoDTO;

    @BeforeEach
    void setUp() {
        userInfoMapperService = new UserInfoMapperService();

        userInfo = UserInfo.builder()
                .id(1L)
                .profileImagePath("/images/profile1.png")
                .dateOfBirth(Date.valueOf(LocalDate.of(1995, 5, 15)))
                .sex("Male")
                .nationality("Nigerian")
                .languagesSpoken(List.of("English", "Hausa"))
                .occupation("Engineer")
                .employmentStatus(EmploymentStatus.FULL_TIME)
                .smokingStatus(SmokingStatus.FREQUENT)
                .addictionStatus(AddictionStatus.ALCOHOL)
                .hasPets(false)
                .petPreference(PetPreference.ALLERGIC)
                .petsAllowed(List.of("Dog"))
                .dietaryRestrictions(DietaryRestrictions.DAIRY_FREE)
                .otherDietaryRestrictions(List.of("None"))
                .cleanlinessLevel(CleanlinessLevel.AVERAGE)
                .sleepSchedule(SleepSchedule.HEAVY_SLEEPER)
                .comfortableWithGuests(ComfortableWithGuests.FREQUENT_GUESTS)
                .partyHabits(PartyHabits.HOSTS_PARTIES)
                .sharesFood(SharesFood.WILLING_TO_SHARE_ALL)
                .preferredRoomTemperature(PreferredRoomTemperature.ANY)
                .willingToShareBathroom(false)
                .hasMedicalConditions(false)
                .medicalConditions(null)
                .isDisabled(false)
                .disability(null)
                .personalityType(PersonalityType.EXTROVERT)
                .noiseTolerance(NoiseTolerance.HIGH)
                .enjoysSocializingWithRoommates(EnjoysSocializingWithRoommates.SOMETIMES)
                .willingToSplitUtilities(false)
                .monthlyIncome(0.00)
                .incomeCurrency("GHS")
                .aboutMe("I love nature and outdoor activities.")
                .build();

        userInfoDTO = UserInfoDTO.builder()
                .id(2L)
                .profileImagePath("/images/profile2.png")
                .dateOfBirth(Date.valueOf(LocalDate.of(2000, 1, 1)))
                .sex("Female")
                .nationality("Ghanaian")
                .languagesSpoken(List.of("English", "Twi"))
                .occupation("Student")
                .employmentStatus(EmploymentStatus.FULL_TIME)
                .smokingStatus(SmokingStatus.FREQUENT)
                .addictionStatus(AddictionStatus.ALCOHOL)
                .hasPets(false)
                .petPreference(PetPreference.ALLERGIC)
                .petsAllowed(List.of("Dog"))
                .dietaryRestrictions(DietaryRestrictions.DAIRY_FREE)
                .otherDietaryRestrictions(List.of("None"))
                .cleanlinessLevel(CleanlinessLevel.AVERAGE)
                .sleepSchedule(SleepSchedule.HEAVY_SLEEPER)
                .comfortableWithGuests(ComfortableWithGuests.FREQUENT_GUESTS)
                .partyHabits(PartyHabits.HOSTS_PARTIES)
                .sharesFood(SharesFood.WILLING_TO_SHARE_ALL)
                .preferredRoomTemperature(PreferredRoomTemperature.ANY)
                .willingToShareBathroom(false)
                .hasMedicalConditions(false)
                .medicalConditions(null)
                .isDisabled(false)
                .disability(null)
                .personalityType(PersonalityType.EXTROVERT)
                .noiseTolerance(NoiseTolerance.HIGH)
                .enjoysSocializingWithRoommates(EnjoysSocializingWithRoommates.SOMETIMES)
                .willingToSplitUtilities(false)
                .monthlyIncome(0.00)
                .incomeCurrency("GHS")
                .aboutMe("I love nature and outdoor activities.")
                .build();
    }

    @Test
    @DisplayName("Should correctly map UserInfo to UserInfoDTO")
    void testToDTO() {
        UserInfoDTO dto = userInfoMapperService.toDTO(userInfo);

        assertNotNull(dto);
        assertEquals(userInfo.getId(), dto.getId());
        assertEquals(userInfo.getSex(), dto.getSex());
        assertEquals(userInfo.getLanguagesSpoken(), dto.getLanguagesSpoken());
        assertEquals(userInfo.getMonthlyIncome(), dto.getMonthlyIncome());
    }

    @Test
    @DisplayName("Should correctly map UserInfoDTO to UserInfo")
    void testToEntity() {
        UserInfo entity = userInfoMapperService.toEntity(userInfoDTO);

        assertNotNull(entity);
        assertEquals(userInfoDTO.getNationality(), entity.getNationality());
        assertEquals(userInfoDTO.getOccupation(), entity.getOccupation());
        assertEquals(userInfoDTO.getPreferredRoomTemperature(), entity.getPreferredRoomTemperature());
        assertFalse(entity.isWillingToShareBathroom());
    }

    @Test
    @DisplayName("Should update UserInfo with values from UserInfoDTO")
    void testUpdateEntity() {
        userInfoMapperService.updateEntity(userInfoDTO, userInfo);

        // Confirm the values are updated to match the DTO
        assertEquals(userInfoDTO.getProfileImagePath(), userInfo.getProfileImagePath());
        assertEquals(userInfoDTO.getDietaryRestrictions(), userInfo.getDietaryRestrictions());
        assertEquals(userInfoDTO.getPersonalityType(), userInfo.getPersonalityType());
        assertEquals(userInfoDTO.getIncomeCurrency(), userInfo.getIncomeCurrency());
    }

    @Test
    @DisplayName("Should not throw NullPointerException when fields are null")
    void testNullSafety() {
        UserInfo nullEntity = new UserInfo();
        UserInfoDTO nullDTO = new UserInfoDTO();

        assertDoesNotThrow(() -> userInfoMapperService.toDTO(nullEntity));
        assertDoesNotThrow(() -> userInfoMapperService.toEntity(nullDTO));
        assertDoesNotThrow(() -> userInfoMapperService.updateEntity(nullDTO, nullEntity));
    }
}
