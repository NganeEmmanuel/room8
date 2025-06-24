import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingForm from './ListingForm';
import { toast } from "react-toastify";
import { useListingService } from '../../../services/ListingService';
// Add this line
import { mapDtoToInitialData } from '../../../constants/listingUtils';


const EditListingPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook to access the state passed during navigation

    // Get the listing object from the navigation state
    const listingToEdit = location.state?.listingToEdit;

    const { updateListing } = useListingService();

    // Set the initial data for the form directly from the object we received
    const [initialData] = useState(mapDtoToInitialData(listingToEdit));

    // This handles the case where the user refreshes the edit page or accesses it directly.
    // In that case, `listingToEdit` will be null.
    useEffect(() => {
        if (!listingToEdit) {
            toast.error("Could not find listing data. Returning to list.");
            navigate('/admin/landlord/listings');
        }
    }, [listingToEdit, navigate]);

    const handleUpdateSubmit = async (listingData) => {
        try {
            await updateListing(listingData);
            navigate('/admin/landlord/listings');
        } catch (error) {
            console.error(`Failed to update listing:`, error);
        }
    };

    // This will show a fallback message while redirecting if the page was refreshed
    if (!initialData) {
        return <div className="p-8 text-center">Redirecting...</div>;
    }

    // The form receives the data instantly and is ready for editing
    return (
        <ListingForm
            initialData={initialData}
            onFormSubmit={handleUpdateSubmit}
            pageTitle="Edit Listing"
            submitButtonText="Save Changes"
        />
    );
};

export default EditListingPage;