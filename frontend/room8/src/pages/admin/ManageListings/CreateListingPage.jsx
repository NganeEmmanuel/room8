// src/pages/Landlord/CreateListing/CreateListingPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm from './ListingForm'; // Your form component
import { useListingService } from '../../../services/useListingService';
import { useAuth } from '../../../context/AuthContext';
import { initialListingData } from '../../../constants/listingUtils';

const CreateListingPage = () => {
    const navigate = useNavigate();
    const { createListing } = useListingService();
    const { authDataState } = useAuth();

    const handleCreateSubmit = async (listingData) => {
        try {
            await createListing(listingData);
            navigate('/admin/landlord/listings');
        } catch (error) {
            console.error("Failed to create listing on page:", error);
        }
    };

    // This guard waits for the App.jsx logic to finish fetching user info.
    // This is why the infinite load error is fixed.
    if (!authDataState.userInfo) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold text-gray-700">Loading User Data...</p>
            </div>
        );
    }

    return (
        <ListingForm
            initialData={initialListingData}
            onFormSubmit={handleCreateSubmit}
            pageTitle="Create New Listing"
            submitButtonText="Create Listing"
        />
    );
};

export default CreateListingPage;