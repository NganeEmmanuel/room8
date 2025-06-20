import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm, { ListingStyle, BathroomLocation } from './ListingForm';
import {toast} from "react-toastify";

// The initial blank state for a new listing
const initialListingData = {
  listingTitle: '', numberOfRooms: 1, roomArea: '', numberOfBathrooms: 1, isSharedBathroom: false, bathroomArea: '', numberOfKitchens: 1, isSharedKitchen: false, kitchenArea: '',
  bathroomLocation: Object.keys(BathroomLocation)[0], listingCountry: '', listingState: '', listingCity: '', listingStreet: '', listingPrice: '', listingDescription: '',
  listingStyle: Object.keys(ListingStyle)[0], numberOfHouseMates: 0, images: [], imagePreviews: [],
};

const CreateListingPage = () => {
    const navigate = useNavigate();

    const handleCreateSubmit = (listingData) => {
        // In a real app, you would make an API POST request here
        console.log("CREATING new listing with data:", listingData);
         toast.success("New listing created successfully!");
        navigate('/admin/landlord/listings');
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