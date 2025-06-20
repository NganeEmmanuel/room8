// src/pages/admin/ManageListings/ManageListingsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../../components/shared/DashboardHeader';
import ListingCard from '../../../components/ListingCard/ListingCard';
import { PlusCircleIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const ManageListingsPage = ({ isLandlordView = false }) => {
  const navigate = useNavigate();

  // Mock data for landlords' listings
  const [landlordListings, setLandlordListings] = useState([
    {
      id: "101",
      title: "Luxury Downtown Apartment",
      location: "City Center, Yaoundé",
      price: 80000,
      currency: "FCFA",
      image: "https://via.placeholder.com/400x250?text=Luxury+Apt",
      roomType: "Entire Apartment",
      toilets: 2,
      kitchen: 1,
      roommates: 0,
      rooms: 3,
      size: "120 sqm",
      views: 145,
      bids: 8,
    },
    {
      id: "102",
      title: "Student-Friendly Room",
      location: "Near University, Ngoa-Ekelle",
      price: 40000,
      currency: "FCFA",
      image: "https://via.placeholder.com/400x250?text=Student+Room",
      roomType: "Private Room",
      toilets: 1,
      kitchen: 1,
      roommates: 2,
      rooms: 1,
      size: "20 sqm",
      views: 89,
      bids: 5,
    },
    {
      id: "103",
      title: "Modern 1-Bedroom Flat",
      location: "Bonamoussadi, Douala",
      price: 65000,
      currency: "FCFA",
      image: "https://via.placeholder.com/400x250?text=Modern+Flat",
      roomType: "Entire Apartment",
      toilets: 1,
      kitchen: 1,
      roommates: 0,
      rooms: 1,
      size: "45 sqm",
      views: 50,
      bids: 2,
    }
  ]);
  // --- NEW: State for controlling the modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  const handleEditListing = (listingId) => {
    navigate(`/admin/landlord/listings/${listingId}/edit`);
  };

  const handleDeleteListing = (listingId) => {
    // Instead of showing window.confirm, we set state to open our modal
    setListingToDelete(listingId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    // This function is called when the user clicks "Confirm" in the modal
    if (!listingToDelete) return;

    console.log(`Deleting listing ${listingToDelete}...`);
    // API call to delete the listing would go here

    setLandlordListings(prev => prev.filter(listing => listing.id !== listingToDelete));

    // Show a success toast!
    toast.success(`Listing ${listingToDelete} has been deleted.`);

    // Close the modal and reset state
    setIsModalOpen(false);
    setListingToDelete(null);
  };

  const handleCreateNewListing = () => {
    navigate('/admin/landlord/listings/new');
  };

  return (
      <>
    <div className="space-y-6">
      <DashboardHeader
        title="Manage Your Listings"
        subtitle="View, edit, or delete your properties"
      />

      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateNewListing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Create New Listing
        </button>
      </div>

      {landlordListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {landlordListings.map(listing => (
            <ListingCard
              key={listing.id}
              listingId={listing.id}
              title={listing.title}
              location={listing.location}
              price={listing.price}
              currency={listing.currency}
              image={listing.image}
              roomType={listing.roomType}
              toilets={listing.toilets}
              kitchen={listing.kitchen}
              roommates={listing.roommates}
              rooms={listing.rooms}
              size={listing.size}
              views={listing.views}
              bids={listing.bids}
              isLandlordView={isLandlordView} // Pass this to show edit/delete buttons
              onEditListing={handleEditListing}
              onDeleteListing={handleDeleteListing}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <BuildingLibraryIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Found</h3>
          <p className="text-gray-500 mb-4">You haven't created any properties yet.</p>
          <button
            onClick={handleCreateNewListing}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Create Your First Listing
          </button>
        </div>
      )}
    </div>
          <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Listing"
      >
        <p>Are you sure you want to permanently delete this listing?</p>
        <p className="mt-2 font-semibold text-red-700">This action cannot be undone.</p>
      </ConfirmModal>
        </>

  );
};

export default ManageListingsPage;