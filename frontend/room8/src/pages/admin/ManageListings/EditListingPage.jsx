import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ListingForm from './ListingForm';
import { MOCK_LISTINGS_DB } from './mockData';
import {toast} from "react-toastify"; // Let's move mock data to its own file

const EditListingPage = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();

  const [listing, setListing] = useState(null);

  useEffect(() => {
    // In a real app, this would be an API call:
    // fetch(`/api/listings/${listingId}`).then(...)
    console.log(`Fetching data for listing ID: ${listingId}`);
    const listingToEdit = MOCK_LISTINGS_DB.find(l => l.id === listingId);
    if (listingToEdit) {
          setListing(listingToEdit);
        } else {
          console.error(`Listing with ID ${listingId} not found.`);
          // --- 2. Replace alert with an error toast ---
          toast.error(`Listing not found! Redirecting...`);
          navigate('/admin/landlord/listings');
        }
      }, [listingId, navigate]);

    const handleUpdateSubmit = (listingData) => {
      // In a real app, this would be a PUT/PATCH request to your API
      console.log(`UPDATING listing ${listingId} with data:`, listingData);

      // --- 3. Replace alert with a success toast ---
      toast.success(`Listing ${listingId} updated successfully!`);

      navigate('/admin/landlord/listings');
    };

  // Show a loading state while fetching data
  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <ListingForm
      initialData={listing}
      onFormSubmit={handleUpdateSubmit}
      pageTitle="Edit Listing"
      submitButtonText="Save Changes"
    />
  );
};

export default EditListingPage;