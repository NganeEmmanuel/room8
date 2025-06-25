// src/components/ListingsCategoryScroller.jsx

import React from 'react';
import ListingCard from './ListingCard/ListingCard'; // Assuming path to your ListingCard

const ListingsCategoryScroller = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No listings to display in this category.
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto space-x-6 p-4 -mx-4">
      {listings.map((listing) => (
        <div key={listing.id} className="flex-shrink-0 w-80">
          {/* --- THIS IS THE FIX --- */}
          {/* We are explicitly mapping the data from the backend `ListingDocument` */}
          {/* to the props that the `ListingCard` component expects. */}
          <ListingCard
            listingId={listing.id}
            title={listing.title}
            location={`${listing.listingCity || ''}, ${listing.listingState || ''}`}
            price={listing.listingPrice}
            image={listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls[0] : undefined}
            roomType={listing.listingType}
            toilets={listing.numberOfBathrooms}
            kitchen={listing.numberOfKitchens}
            roommates={listing.numberOfHouseMates}
            rooms={listing.numberOfRooms}
            size={listing.roomArea ? `${listing.roomArea} sqm` : 'N/A'}
            // Set default values for props not available in the search result
            views={0}
            bids={0}
            isWishlisted={false}
          />
        </div>
      ))}
    </div>
  );
};

export default ListingsCategoryScroller;