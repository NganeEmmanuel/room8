package com.room8.userservice.model;

import com.room8.userservice.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserInfoDTO {
    private Long id;
    private String profileImagePath;
    private Date dateOfBirth;
    private String sex;
    private String nationality;
    private List<String> languagesSpoken;
    private String occupation;
    private EmploymentStatus employmentStatus;

    // Lifestyle & Habits
    private SmokingStatus smokingStatus;
    private AddictionStatus addictionStatus;
    private boolean hasPets;
    private PetPreference petPreference; // if user has pets enters the preference
    private List<String> petsAllowed; // if others is chosen in pets preference
    private DietaryRestrictions dietaryRestrictions;
    private List<String> otherDietaryRestrictions; // if other is chosen in dietary restrictions
    private CleanlinessLevel cleanlinessLevel;
    private SleepSchedule sleepSchedule;
    private ComfortableWithGuests comfortableWithGuests;
    private PartyHabits partyHabits;
    private SharesFood sharesFood;
    private PreferredRoomTemperature preferredRoomTemperature;
    private boolean willingToShareBathroom;

    // health information
    private boolean hasMedicalConditions;
    private List<String> medicalConditions;
    private boolean isDisabled;
    private String disability; // paralyze, blind, handicap, etc, no disability,

    // Personality & Social Habits
    private PersonalityType personalityType;
    private NoiseTolerance noiseTolerance;
    private EnjoysSocializingWithRoommates enjoysSocializingWithRoommates;

    //financial responsibility
    private boolean willingToSplitUtilities; // yes or no (true or false respectively)
    private Double monthlyIncome;
    private String incomeCurrency; // USD, EURO, POUND, CFA, NAIRA, etc

    // Bio/about
    private String aboutMe;
}
