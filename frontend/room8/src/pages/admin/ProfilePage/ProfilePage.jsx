
import React, { useState, useEffect } from 'react';
import UserProfileDisplayPage from './UserProfileDisplayPage';
import EditProfilePanel from '../SettingsPage/EditProfilePanel';

const mockUserProfileData = {
  firstName: 'Alex', lastName: 'Morgan', email: 'alex.morgan@example.com', isEmailVerified: true, phoneNumber: '+1234567890', isPhoneVerified: false,
  role: ['Tenant', 'Landlord'], profileImagePath: '', dateOfBirth: '1990-08-25', sex: 'Female', nationality: 'American', languagesSpoken: ['English', 'Spanish'],
  occupation: 'Software Developer', smokingStatus: 'Non-smoker', hasPets: true, petsAllowed: ['Golden Retriever'], cleanlinessLevel: 'Moderately Tidy',
  aboutMe: 'Friendly and respectful individual looking for a peaceful living environment. I enjoy reading, hiking, and occasional movie nights.',
  theme: 'Light Mode',
  phoneNumberVisibility: 'Connections Only', emailVisibility: 'Everyone', lifestyleHabitsVisibility: 'Everyone',

  // --- New Fields Added ---
  // Lifestyle & Habits
  dietaryRestrictions: 'None',
  otherDietaryRestrictions: [],
  sleepSchedule: 'Average (10 PM - 12 AM)',
  comfortableWithGuests: 'Guests on Occasion',
  partyHabits: 'Rarely',
  sharesFood: 'Sometimes, if asked',
  preferredRoomTemperature: 'Moderate (68-74°F/20-23°C)',
  willingToShareBathroom: true,

  // Health Information
  hasMedicalConditions: false,
  medicalConditions: [],
  isDisabled: false,
  disability: '',

  // Personality & Social Habits
  personalityType: 'Ambivert',
  noiseTolerance: 'Moderate',
  enjoysSocializingWithRoommates: 'Sometimes, I\'m open to it',

  // Financial Responsibility
  willingToSplitUtilities: true,
  monthlyIncome: 5000,
  incomeCurrency: 'FCFA',
};

const ProfilePage = () => {
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [userProfileData, setUserProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // This effect now FORCES light mode for the profile page to match the design.
    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setUserProfileData(mockUserProfileData);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleSaveProfile = (updatedData) => {
        console.log("Saving PROFILE data:", updatedData);
        setUserProfileData(updatedData);
        setIsEditPanelOpen(false);
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading Profile...</div>;
    }

    return (
        <div className="relative">
            <UserProfileDisplayPage
                profileData={userProfileData}
                onEditProfile={() => setIsEditPanelOpen(true)}
            />
            <EditProfilePanel
                isOpen={isEditPanelOpen}
                onClose={() => setIsEditPanelOpen(false)}
                onSave={handleSaveProfile}
                initialData={userProfileData}
            />
        </div>
    );
};

export default ProfilePage;