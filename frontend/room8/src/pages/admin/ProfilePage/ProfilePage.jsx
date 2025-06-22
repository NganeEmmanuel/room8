
import React, { useState, useEffect } from 'react';
import UserProfileDisplayPage from './UserProfileDisplayPage';
import EditProfilePanel from '../SettingsPage/EditProfilePanel';
import { useUserService } from '../../../services/userService/userService';
import { useUserData } from '../../../context/UserDataContext';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/shared/Loader';


const ProfilePage = () => {
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [userProfileData, setUserProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { getUserData } = useUserService();
    const { updateUserData } = useUserData();
    const { authDataState } = useAuth();
    const { userInfo } = authDataState;

    const userId = userInfo?.id

    useEffect(() => {
        setIsLoading(true);
        const loadData = async () => {
            try {
            const data = await getUserData(userId); // e.g. from URL or auth info
            updateUserData(data);
            setUserProfileData(data)
            setIsLoading(false);
            } catch (e) {
            console.error("Failed to load extended user data");
            }
        };
        loadData();
    }, [userId]);

    // This effect now FORCES light mode for the profile page to match the design.
    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    const handleSaveProfile = (updatedData) => {
        console.log("Saving PROFILE data:", updatedData); //remove console logs
        setUserProfileData(updatedData);
        setIsEditPanelOpen(false);
    };

    if (isLoading || !userProfileData) {
        return <Loader />
    }

    return (
        <div className="relative">
            <UserProfileDisplayPage
                userinfo={userInfo}
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