// src/pages/Landlord/ManageListings/ManageListingsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../../components/shared/DashboardHeader';
import ListingCard from '../../../components/ListingCard/ListingCard';
import { PlusCircleIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { useListingService } from '../../../services/useListingService'; // <-- Use the new service hook
import { useAuth } from '../../../context/AuthContext';

const ManageListingsPage = ({ isLandlordView = true }) => {
    // --- Hooks ---
    const navigate = useNavigate();
    const { getMyListings, deleteListing } = useListingService();
    const { authDataState } = useAuth(); // <-- Get authDataState correctly

    // --- State Management ---
    const [listings, setListings] = useState([]);
    const [isListingsLoading, setIsListingsLoading] = useState(true); // Renamed for clarity
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);

    // --- Data Fetching ---
    const fetchListings = useCallback(async () => {
        setIsListingsLoading(true);
        try {
            const data = await getMyListings();
            setListings(data);
        } catch (error) {
            // The service hook now handles error toasts
            console.error("Error fetching listings:", error);
             setListings([]);
        } finally {
            setIsListingsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Only fetch if the user info has been loaded by the App-level component
        if (authDataState.userInfo) {
            fetchListings();
        }
    }, [authDataState.userInfo, fetchListings]);

    // --- Event Handlers (Your function names are preserved) ---
    const handleCreateNewListing = () => {
        navigate('/admin/landlord/listings/new');
    };

    const handleEditListing = (listing) => {
        navigate(`/admin/landlord/listings/${listing.id}/edit`, { state: { listingToEdit: listing } });
    };

    const handleDeleteClick = (listing) => {
        setListingToDelete(listing);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!listingToDelete) return;

        try {
            await deleteListing(listingToDelete.id, listingToDelete.listingType);
            // The success toast can be in the service, but keeping it here is also fine.
            toast.success(`Listing "${listingToDelete.title}" has been deleted.`);
            setListings(prevListings => prevListings.filter(listing => listing.id !== listingToDelete.id));
        } catch (error) {
            // Service handles the error toast
            console.error(`Failed to delete listing ${listingToDelete.id}:`, error);
        } finally {
            setIsModalOpen(false);
            setListingToDelete(null);
        }
    };

    // --- JSX Rendering ---

    // GUARD 1: Wait for the App component to load user info into the context.
    if (!authDataState.userInfo) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Loading User Data...</p>
            </div>
        );
    }

    // GUARD 2: Show a loader while fetching the listings specifically.
    if (isListingsLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Loading your listings...</p>
            </div>
        );
    }

    // Your original JSX is preserved below
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

                {listings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listingId={listing.id}
                                title={listing.title}
                                location={`${listing.listingCity}, ${listing.listingState}`}
                                price={listing.listingPrice}
                                image={listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls[0] : undefined}
                                roomType={listing.listingType}
                                toilets={listing.numberOfBathrooms}
                                kitchen={listing.numberOfKitchens}
                                roommates={listing.numberOfHouseMates}
                                rooms={listing.numberOfRooms}
                                size={`${listing.roomArea} sqm`}
                                views={listing.views || 0}
                                bids={listing.bids || 0}
                                isWishlisted={false}
                                isLandlordView={isLandlordView}
                                onEditListing={() => handleEditListing(listing)}
                                onDeleteListing={() => handleDeleteClick(listing)}
                                onWishlistClick={() => { /* Placeholder */ }}
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