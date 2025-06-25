// src/pages/SearchPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchService } from '../services/useSearchService';
import ListingCard from '../components/ListingCard/ListingCard';
import Spinner from '../pages/ListingDetailsPage/components/Spinner.jsx/';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { searchListings } = useSearchService();

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const query = searchParams.get('query');
  const city = searchParams.get('city');

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      // Pass both query and city to the service
      const data = await searchListings({ query, city });
      setResults(data);
    } catch (error) {
      console.error("Failed to perform search:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, city, searchListings]);

  useEffect(() => {
    // Run search if either query or city is present
    if (query || city) {
      performSearch();
    } else {
      setIsLoading(false);
      setResults([]);
    }
  }, [performSearch, query, city]);

  const renderContent = () => {
    if (isLoading) {
      return <Spinner />;
    }
    if (results.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* --- THIS IS THE FIX --- */}
          {results.map(listing => (
            <ListingCard
              key={listing.id}
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
            />
          ))}
        </div>
      );
    }
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-600">No listings found for your search.</p>
        <p className="text-gray-500 mt-2">Try a different search term or browse our categories.</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-md text-gray-500 mb-6">
        Showing results for: <span className="font-semibold text-gray-700">"{query || city}"</span>
      </p>
      {renderContent()}
    </div>
  );
};

export default SearchPage;