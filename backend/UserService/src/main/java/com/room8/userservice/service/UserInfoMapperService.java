package com.room8.userservice.service;

import com.room8.userservice.model.UserInfo;
import com.room8.userservice.model.UserInfoDTO;
import org.springframework.stereotype.Service;

@Service
public class UserInfoMapperService implements MapperService<UserInfoDTO, UserInfo> {

    @Override
    public UserInfoDTO toDTO(UserInfo userInfo) {
        return UserInfoDTO.builder()
                .id(userInfo.getId())
                .profileImagePath(userInfo.getProfileImagePath())
                .dateOfBirth(userInfo.getDateOfBirth())
                .sex(userInfo.getSex())
                .nationality(userInfo.getNationality())
                .languagesSpoken(userInfo.getLanguagesSpoken())
                .occupation(userInfo.getOccupation())
                .employmentStatus(userInfo.getEmploymentStatus())

                //lifestyle
                .smokingStatus(userInfo.getSmokingStatus())
                .addictionStatus(userInfo.getAddictionStatus())
                .hasPets(userInfo.isHasPets())
                .petPreference(userInfo.getPetPreference())
                .petsAllowed(userInfo.getPetsAllowed())
                .dietaryRestrictions(userInfo.getDietaryRestrictions())
                .otherDietaryRestrictions(userInfo.getOtherDietaryRestrictions())
                .cleanlinessLevel(userInfo.getCleanlinessLevel())
                .sleepSchedule(userInfo.getSleepSchedule())
                .comfortableWithGuests(userInfo.getComfortableWithGuests())
                .partyHabits(userInfo.getPartyHabits())
                .sharesFood(userInfo.getSharesFood())
                .preferredRoomTemperature(userInfo.getPreferredRoomTemperature())
                .willingToShareBathroom(userInfo.isWillingToShareBathroom())

                //health
                .hasMedicalConditions(userInfo.isHasMedicalConditions())
                .medicalConditions(userInfo.getMedicalConditions())
                .isDisabled(userInfo.isDisabled())
                .disability(userInfo.getDisability())

                //personality and social
                .personalityType(userInfo.getPersonalityType())
                .noiseTolerance(userInfo.getNoiseTolerance())
                .enjoysSocializingWithRoommates(userInfo.getEnjoysSocializingWithRoommates())

                //financial
                .willingToSplitUtilities(userInfo.isWillingToSplitUtilities())
                .monthlyIncome(userInfo.getMonthlyIncome())
                .incomeCurrency(userInfo.getIncomeCurrency())

                // Bio/about
                .aboutMe(userInfo.getAboutMe())

                .build();
    }

    @Override
    public UserInfo toEntity(UserInfoDTO userInfoDTO) {
        return UserInfo.builder()
                .id(userInfoDTO.getId())
                .profileImagePath(userInfoDTO.getProfileImagePath())
                .dateOfBirth(userInfoDTO.getDateOfBirth())
                .sex(userInfoDTO.getSex())
                .nationality(userInfoDTO.getNationality())
                .languagesSpoken(userInfoDTO.getLanguagesSpoken())
                .occupation(userInfoDTO.getOccupation())
                .employmentStatus(userInfoDTO.getEmploymentStatus())

                //lifestyle
                .smokingStatus(userInfoDTO.getSmokingStatus())
                .addictionStatus(userInfoDTO.getAddictionStatus())
                .hasPets(userInfoDTO.isHasPets())
                .petPreference(userInfoDTO.getPetPreference())
                .petsAllowed(userInfoDTO.getPetsAllowed())
                .dietaryRestrictions(userInfoDTO.getDietaryRestrictions())
                .otherDietaryRestrictions(userInfoDTO.getOtherDietaryRestrictions())
                .cleanlinessLevel(userInfoDTO.getCleanlinessLevel())
                .sleepSchedule(userInfoDTO.getSleepSchedule())
                .comfortableWithGuests(userInfoDTO.getComfortableWithGuests())
                .partyHabits(userInfoDTO.getPartyHabits())
                .sharesFood(userInfoDTO.getSharesFood())
                .preferredRoomTemperature(userInfoDTO.getPreferredRoomTemperature())
                .willingToShareBathroom(userInfoDTO.isWillingToShareBathroom())

                //health
                .hasMedicalConditions(userInfoDTO.isHasMedicalConditions())
                .medicalConditions(userInfoDTO.getMedicalConditions())
                .isDisabled(userInfoDTO.isDisabled())
                .disability(userInfoDTO.getDisability())

                //personality and social
                .personalityType(userInfoDTO.getPersonalityType())
                .noiseTolerance(userInfoDTO.getNoiseTolerance())
                .enjoysSocializingWithRoommates(userInfoDTO.getEnjoysSocializingWithRoommates())

                //financial
                .willingToSplitUtilities(userInfoDTO.isWillingToSplitUtilities())
                .monthlyIncome(userInfoDTO.getMonthlyIncome())
                .incomeCurrency(userInfoDTO.getIncomeCurrency())

                // Bio/about
                .aboutMe(userInfoDTO.getAboutMe())

                .build();
    }

    @Override
    public void updateEntity(UserInfoDTO userInfoDTO, UserInfo userInfo) {
        userInfo.setProfileImagePath(userInfoDTO.getProfileImagePath());
        userInfo.setDateOfBirth(userInfoDTO.getDateOfBirth());
        userInfo.setSex(userInfoDTO.getSex());
        userInfo.setNationality(userInfoDTO.getNationality());
        userInfo.setLanguagesSpoken(userInfoDTO.getLanguagesSpoken());
        userInfo.setOccupation(userInfoDTO.getOccupation());
        userInfo.setEmploymentStatus(userInfoDTO.getEmploymentStatus());

        //lifestyle
        userInfo.setSmokingStatus(userInfoDTO.getSmokingStatus());
        userInfo.setAddictionStatus(userInfoDTO.getAddictionStatus());
        userInfo.setHasPets(userInfoDTO.isHasPets());
        userInfo.setPetPreference(userInfoDTO.getPetPreference());
        userInfo.setPetsAllowed(userInfoDTO.getPetsAllowed());
        userInfo.setDietaryRestrictions(userInfoDTO.getDietaryRestrictions());
        userInfo.setOtherDietaryRestrictions(userInfoDTO.getOtherDietaryRestrictions());
        userInfo.setCleanlinessLevel(userInfoDTO.getCleanlinessLevel());
        userInfo.setSleepSchedule(userInfoDTO.getSleepSchedule());
        userInfo.setComfortableWithGuests(userInfoDTO.getComfortableWithGuests());
        userInfo.setPartyHabits(userInfoDTO.getPartyHabits());
        userInfo.setSharesFood(userInfoDTO.getSharesFood());
        userInfo.setPreferredRoomTemperature(userInfoDTO.getPreferredRoomTemperature());
        userInfo.setWillingToShareBathroom(userInfoDTO.isWillingToShareBathroom());

        // health
        userInfo.setHasMedicalConditions(userInfoDTO.isHasMedicalConditions());
        userInfo.setMedicalConditions(userInfoDTO.getMedicalConditions());
        userInfo.setDisabled(userInfoDTO.isDisabled());
        userInfo.setDisability(userInfoDTO.getDisability());

        // Personal and social
        userInfo.setPersonalityType(userInfoDTO.getPersonalityType());
        userInfo.setNoiseTolerance(userInfoDTO.getNoiseTolerance());
        userInfo.setEnjoysSocializingWithRoommates(userInfoDTO.getEnjoysSocializingWithRoommates());

        //financial
        userInfo.setWillingToSplitUtilities(userInfoDTO.isWillingToSplitUtilities());
        userInfo.setMonthlyIncome(userInfoDTO.getMonthlyIncome());
        userInfo.setIncomeCurrency(userInfoDTO.getIncomeCurrency());

        // Bio/about
        userInfo.setAboutMe(userInfoDTO.getAboutMe());
    }
}
