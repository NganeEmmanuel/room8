// src/pages/ListingsSearchResultsPage.jsx

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard/ListingCard";
import Spinner from "./ListingDetailsPage/components/Spinner.jsx";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";
import { useSearchService } from '../services/useSearchService';
import { Bars3Icon } from '@heroicons/react/24/solid';

const ListingsSearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {searchListingsWithFilter } = useSearchService();

  // Component State
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [totalResults, setTotalResults] = useState(0);

  // Define the master list of possible room types
  const [allRoomTypes] = useState(['SingleRoom', 'Apartment', 'Studio']);

  // A single state object to hold all the current filter values
  const [filterValues, setFilterValues] = useState({
    query: '', city: '', minPrice: '', maxPrice: '', sort: '', selectedRoomTypes: [],
  });

  // Effect 1: Sync the URL search parameters to our state when the page loads
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilterValues({
      query: params.query || '',
      city: params.city || '',
      minPrice: params.minPrice || '',
      maxPrice: params.maxPrice || '',
      sort: params.sort || '',
      selectedRoomTypes: params.listingType ? params.listingType.split(',') : [],
    });
  }, [searchParams]);

  // Effect 2: Fetch data from the backend whenever the URL changes
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const page = parseInt(params.page || '0', 10);
      const size = 12;

      // Always build a filter object to send to the powerful POST endpoint
      const filterDTO = {
        query: params.query || null,
        city: params.city || null,
        minPrice: params.minPrice ? parseFloat(params.minPrice) : null,
        maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : null,
        listingType: params.listingType ? params.listingType.split(',')[0] : null, // Backend seems to support one type, so we send the first
        // You can add more filters to the DTO here as you expand
      };

      const data = await searchListingsWithFilter(filterDTO, page, size);
      setListings(data);
      // setTotalResults(response.totalElements); // When your backend provides total count
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, searchListingsWithFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Event Handlers ---

  const handleFilterChange = (filterName, value) => {
    setFilterValues(prev => ({ ...prev, [filterName]: value }));
  };

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();
    if (filterValues.query) newParams.set("query", filterValues.query);
    if (filterValues.city) newParams.set("city", filterValues.city);
    if (filterValues.minPrice) newParams.set("minPrice", filterValues.minPrice);
    if (filterValues.maxPrice) newParams.set("maxPrice", filterValues.maxPrice);
    if (filterValues.sort) newParams.set("sort", filterValues.sort);
    if (filterValues.selectedRoomTypes && filterValues.selectedRoomTypes.length > 0) {
      newParams.set("listingType", filterValues.selectedRoomTypes.join(','));
    }
    setSearchParams(newParams);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { query: '', city: '', minPrice: '', maxPrice: '', sort: '', selectedRoomTypes: [] };
    setFilterValues(clearedFilters);
    setSearchParams(new URLSearchParams());
  };

  // const handlePageChange = (newPage) => {
  //   const newParams = new URLSearchParams(searchParams);
  //   newParams.set('page', newPage - 1);
  //   setSearchParams(newParams);
  // };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:block w-72 sticky top-0 h-screen border-r bg-white shadow-sm">
        <FilterSidebar
          allRoomTypes={allRoomTypes}
          filters={filterValues}
          onFilterChange={handleFilterChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </aside>

      <main className="flex-1">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b p-4 flex items-center gap-4">
            <button
                className="md:hidden p-2 rounded-md hover:bg-gray-200"
                onClick={() => setIsFilterOpen(true)}
            >
                <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Search Results
            </h1>
        </div>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <Spinner />
          ) : listings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
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
                    size={listing.roomArea ? `${listing.roomArea} sqm` : 'N/A'}
                  />
                ))}
              </div>
               {/*<Pagination currentPage={} totalPages={} onPageChange={handlePageChange()} /> */}
            </>
          ) : (
            <div className="text-center py-16 px-4">
              <p className="text-xl font-semibold text-gray-700">No listings found.</p>
              <p className="text-gray-500 mt-2">Try adjusting or clearing your filters to see more results.</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile filter drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setIsFilterOpen(false)}>
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <FilterSidebar
              allRoomTypes={allRoomTypes}
              filters={filterValues}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsSearchResultsPage;