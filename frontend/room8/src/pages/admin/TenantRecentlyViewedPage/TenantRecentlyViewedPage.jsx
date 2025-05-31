// src/pages/admin/TenantRecentlyViewedPage/TenantRecentlyViewedPage.jsx
import React from 'react';
import DashboardHeader from '../../../components/shared/DashboardHeader';
import ListingCard from '../../../components/ListingCard/ListingCard';
import { EyeIcon } from '@heroicons/react/24/outline';

const TenantRecentlyViewedPage = () => {
  // Mock recently viewed listings data
  const recentlyViewedListings = [
    {
      id: "v1",
      title: "Charming Apartment with Balcony",
      location: "Bastoss, Yaoundé",
      price: 750,
      currency: "FCFA",
      image: "https://via.placeholder.com/400x250?text=Charming+Apt",
      roomType: "Entire Apartment",
      toilets: 1,
      kitchen: 1,
      roommates: 0,
      rooms: 2,
      size: "60 sqm",
      isWishlisted: false, // Could be wishlisted or not
    },
    {
      id: "v2",
      title: "Shared Room Near ENS",
      location: "Ngoa-Ekelle, Yaoundé",
      price: 300,
      currency: "FCFA",
      image: "https://via.placeholder.com/400x250?text=Shared+Room",
      roomType: "Shared Room",
      toilets: 1,
      kitchen: 1,
      roommates: 1,
      rooms: 1,
      size: "18 sqm",
      isWishlisted: true,
    },
     {
      id: "v3",
      title: "Modern Studio in City Center",
      location: "Mvog-Ada, Yaoundé",
      price: 550,
      currency: "FCFA",
      image: "https://via.placeholder.com/400x250?text=Modern+Studio",
      roomType: "Studio",
      toilets: 1,
      kitchen: 1,
      roommates: 0,
      rooms: 1,
      size: "30 sqm",
      isWishlisted: false,
    }
  ];

  const handleWishlistToggle = (listingId, currentStatus) => {
    console.log(`Toggling wishlist for ${listingId}. Current status: ${currentStatus}`);
    // In a real app, you'd make an API call here.
    alert(`Simulating wishlist toggle for listing ${listingId}. Current status: ${currentStatus}`);
    // You might update the local state to reflect the change, or refetch.
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Recently Viewed Listings" subtitle="Explore properties you've recently checked out" />

      {recentlyViewedListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentlyViewedListings.map(listing => (
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
          <EyeIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recently Viewed Listings</h3>
          <p className="text-gray-500 mb-4">Start Browse listings to see them appear here!</p>
          <button
            onClick={() => window.location.href = '/listings'} // Navigate to public listings page
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Explore Listings
          </button>
        </div>
      )}
    </div>
  );
};

export default TenantRecentlyViewedPage;