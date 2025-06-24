import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm from './ListingForm';
import { toast } from "react-toastify";
import { useListingService } from '../../../services/ListingService';
import { useAuth } from '../../../context/AuthContext';
// Add this line
import { initialListingData } from '../../../constants/listingUtils';

const CreateListingPage = () => {
    const navigate = useNavigate();
    const { createListing } = useListingService();

    const { userInfo } = useAuth();

    const handleCreateSubmit = async (listingData) => {
        // Check for user info before submitting
        if (!userInfo || !userInfo.id) {
            toast.error("User information not available. Please wait or try logging in again.");
            return;
        }

        try {
            await createListing(listingData);
            // The success toast is already in the service, so no need to repeat it here.
            navigate('/admin/landlord/listings');
        } catch (error) {
            // The service also toasts errors, so just logging here is fine.
            console.error("Failed to create listing:", error);
        }
    };

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