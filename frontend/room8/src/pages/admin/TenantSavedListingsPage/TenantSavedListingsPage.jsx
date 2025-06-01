// src/pages/admin/TenantSavedListingsPage/TenantSavedListingsPage.jsx
import React from 'react';
import DashboardHeader from '../../../components/shared/DashboardHeader';
import ListingCard from '../../../components/ListingCard/ListingCard';
import { HeartIcon } from '@heroicons/react/24/outline';

const TenantSavedListingsPage = () => {
  // Mock saved listings data for this full page
  const savedListings = [
    {
      id: "1",
      title: "Modern Room in Shared House",
      location: "Downtown Campus Area",
      price: 450,
      currency: "FCFA",
      image: "https://via.placeholder.com/400x250?text=Modern+Room",
      roomType: "Private Room",
      toilets: 1,
      kitchen: 1,
      roommates: 3,
      rooms: 1,
      size: "15 sqm",
      isWishlisted: true, // Should always be true on this page
    },
    {
      id: "2",
      title: "Cozy Studio Apartment",
      location: "Near University",
      price: 600,
      currency: "FCFA",
      image: "https://via.placeholder.com/400x250?text=Cozy+Studio",
      roomType: "Studio",
      toilets: 1,
      kitchen: 1,
      roommates: 0, // No roommates in a studio
      rooms: 1,
      size: "25 sqm",
      isWishlisted: true,
    },
    {
      id: "3",
      title: "Spacious 2-Bedroom Flat",
      location: "Residential Zone",
      price: 1200,
      currency: "FCFA",
      image: "https://via.placeholder.com/400x250?text=2+Bedroom+Flat",
      roomType: "Entire Apartment",
      toilets: 2,
      kitchen: 1,
      roommates: 0,
      rooms: 2,
      size: "70 sqm",
      isWishlisted: true,
    }
  ];

  const handleWishlistToggle = (listingId, currentStatus) => {
    console.log(`Toggling wishlist for ${listingId} from full page. Current status: ${currentStatus}`);
    // In a real app, you'd make an API call here to update the wishlist.
    // After successful API call, you would typically refetch the listings or update local state.
    alert(`Simulating un-wishlist for listing ${listingId}. (Would remove from list)`);
    // For now, we'll just remove it from the local state for demonstration
    // setSavedListings(prev => prev.filter(listing => listing.id !== listingId));
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Your Saved Listings" subtitle="All the properties you've wishlisted" />

      {savedListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map(listing => (
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
              isWishlisted={listing.isWishlisted}
              onWishlistClick={handleWishlistToggle}
              isLandlordView={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <HeartIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Listings Found</h3>
          <p className="text-gray-500 mb-4">It looks like you haven't added any properties to your wishlist yet.</p>
          <button
            onClick={() => window.location.href = '/listings'} // Navigate to public listings page
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Start Exploring Listings
          </button>
        </div>
      )}
    </div>
  );
};

export default TenantSavedListingsPage;