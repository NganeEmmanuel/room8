package com.room8.bidservice.model;

import com.room8.bidservice.enums.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user_info")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserInfo {
    // Basic user Info
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "bid_id", referencedColumnName = "id", nullable = false, unique = true) // Foreign key in UserInfo table
    private Bid bid;
    private String profileImagePath;
    private Date dateOfBirth;
    private String sex;
    private String nationality;

    @ElementCollection
    private List<String> languagesSpoken;

    private String occupation;
    @Enumerated(EnumType.STRING)
    private EmploymentStatus employmentStatus;

    // Lifestyle & Habits
    @Enumerated(EnumType.STRING)
    private SmokingStatus smokingStatus;
    @Enumerated(EnumType.STRING)
    private AddictionStatus addictionStatus;

    private boolean hasPets;
    @Enumerated(EnumType.STRING)
    private PetPreference petPreference; // if user has pets enters the preference
    @ElementCollection
    private List<String> petsAllowed; // if others is chosen in pets preference

    @Enumerated(EnumType.STRING)
    private DietaryRestrictions dietaryRestrictions;
    @ElementCollection
    private List<String> otherDietaryRestrictions; // if other is chosen in dietary restrictions

    @Enumerated(EnumType.STRING)
    private CleanlinessLevel cleanlinessLevel;
    @Enumerated(EnumType.STRING)
    private SleepSchedule sleepSchedule;
    @Enumerated(EnumType.STRING)
    private ComfortableWithGuests comfortableWithGuests;
    @Enumerated(EnumType.STRING)
    private PartyHabits partyHabits;
    @Enumerated(EnumType.STRING)
    private SharesFood sharesFood;
    @Enumerated(EnumType.STRING)
    private PreferredRoomTemperature preferredRoomTemperature;
    private boolean willingToShareBathroom;

    // health information
    private boolean hasMedicalConditions;
    @ElementCollection
    private List<String> medicalConditions;

    private boolean isDisabled;
    private String disability; // paralyze, blind, handicap, etc, no disability,

    // Personality & Social Habits
    @Enumerated(EnumType.STRING)
    private PersonalityType personalityType;
    @Enumerated(EnumType.STRING)
    private NoiseTolerance noiseTolerance;
    @Enumerated(EnumType.STRING)
    private EnjoysSocializingWithRoommates enjoysSocializingWithRoommates;

    //financial responsibility
    private boolean willingToSplitUtilities; // yes or no (true or false respectively)
    private Double monthlyIncome;
    private String incomeCurrency; // USD, EURO, POUND, CFA, NAIRA, etc

    // Todo this section can be added to the user posting about wanting a room mate without having any room. I the case that someone can see it and choose them
    // private double rentBudget;
    // private String paymentPreference; // Monthly, bi-weekly

    // Bio/About
    @Column(length = 5000)
    private String aboutMe;
}
