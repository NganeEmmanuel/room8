package com.room8.userservice.model;

import com.room8.userservice.enums.*;
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
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true) // Foreign key in UserInfo table
    private User user;
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

    @Temporal(TemporalType.TIMESTAMP)
    @Column(updatable = false)
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdated;


    @PrePersist
    protected void onCreate() {
        createdDate = new Date();
        lastUpdated = new Date();
    }

    // 📦 Deep Copy Constructor
    public UserInfo(UserInfo other) {
        this.id = other.id;
        this.profileImagePath = other.profileImagePath;
        this.dateOfBirth = other.dateOfBirth != null ? new Date(other.dateOfBirth.getTime()) : null;
        this.sex = other.sex;
        this.nationality = other.nationality;
        this.languagesSpoken = other.languagesSpoken != null ? List.copyOf(other.languagesSpoken) : null;
        this.occupation = other.occupation;
        this.employmentStatus = other.employmentStatus;
        this.smokingStatus = other.smokingStatus;
        this.addictionStatus = other.addictionStatus;
        this.hasPets = other.hasPets;
        this.petPreference = other.petPreference;
        this.petsAllowed = other.petsAllowed != null ? List.copyOf(other.petsAllowed) : null;
        this.dietaryRestrictions = other.dietaryRestrictions;
        this.otherDietaryRestrictions = other.otherDietaryRestrictions != null ? List.copyOf(other.otherDietaryRestrictions) : null;
        this.cleanlinessLevel = other.cleanlinessLevel;
        this.sleepSchedule = other.sleepSchedule;
        this.comfortableWithGuests = other.comfortableWithGuests;
        this.partyHabits = other.partyHabits;
        this.sharesFood = other.sharesFood;
        this.preferredRoomTemperature = other.preferredRoomTemperature;
        this.willingToShareBathroom = other.willingToShareBathroom;
        this.hasMedicalConditions = other.hasMedicalConditions;
        this.medicalConditions = other.medicalConditions != null ? List.copyOf(other.medicalConditions) : null;
        this.isDisabled = other.isDisabled;
        this.disability = other.disability;
        this.personalityType = other.personalityType;
        this.noiseTolerance = other.noiseTolerance;
        this.enjoysSocializingWithRoommates = other.enjoysSocializingWithRoommates;
        this.willingToSplitUtilities = other.willingToSplitUtilities;
        this.monthlyIncome = other.monthlyIncome;
        this.incomeCurrency = other.incomeCurrency;
        this.aboutMe = other.aboutMe;
        this.createdDate = other.createdDate != null ? new Date(other.createdDate.getTime()) : null;
        this.lastUpdated = other.lastUpdated != null ? new Date(other.lastUpdated.getTime()) : null;
        this.user = null; // ❗ Important: not copying user link to avoid circular reference
    }
}
