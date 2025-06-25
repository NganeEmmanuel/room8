// src/pages/HomePage/HomePage.jsx

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ListingsCategoryScroller from "../../components/ListingCategoryScroller.jsx";
import { useSearchService } from "../../services/useSearchService.js";
import heroImage from "../../assets/images/heroimage.png";
import Spinner from "../ListingDetailsPage/components/Spinner.jsx"; // Assuming you have a spinner

const HomePage = () => {
  // --- STATE MANAGEMENT ---
  // A separate state for each category on the homepage
  const [listingsInCity, setListingsInCity] = useState([]);
  const [affordableListings, setAffordableListings] = useState([]);
  const [singleRoomListings, setSingleRoomListings] = useState([]);
  const [apartmentListings, setApartmentListings] = useState([]);
  const [recentlyListed, setRecentlyListed] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { searchListingsWithFilter } = useSearchService();

  // --- DATA FETCHING ---
  const fetchAllCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      // We will run all our specific searches in parallel for performance
      const [
        cityResults,
        affordableResults,
        singleRoomResults,
        apartmentResults,
        recentResults,
      ] = await Promise.all([
        // For "Listings in Your City", we can pick a default city like Yaoundé
        searchListingsWithFilter({ city: "Yaoundé" }, 0, 10),
        // For "Affordable", we can set a max price
        searchListingsWithFilter({ maxPrice: 75000 }, 0, 10),
        // For "Single Room", we filter by the exact listingType
        searchListingsWithFilter({ listingType: "SingleRoom" }, 0, 10),
        // For "Apartment"
        searchListingsWithFilter({ listingType: "Apartment" }, 0, 10),
        // For "Recently Listed", we send an empty filter, which sorts by date
        searchListingsWithFilter({}, 0, 10)
      ]);

      // Update each state with its specific results
      setListingsInCity(cityResults);
      setAffordableListings(affordableResults);
      setSingleRoomListings(singleRoomResults);
      setApartmentListings(apartmentResults);
      setRecentlyListed(recentResults);

    } catch (error) {
      console.error("Failed to fetch homepage categories:", error);
      // Don't show an error toast on the homepage for a better user experience
    } finally {
      setIsLoading(false);
    }
  }, [searchListingsWithFilter]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // We navigate to the search page using the `city` parameter as configured
    navigate(`/search?city=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section
          className="bg-cover bg-no-repeat bg-center text-black py-40 px-4"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
              Easily Find Rooms, Apartments and Roommates
            </h1>
            <p className="text-lg sm:text-2xl font-medium mb-8 text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
              Simple, Fast, Trusted by Renters & Landlords
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center items-center font-bold gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a city to begin your search..."
                className="w-full sm:w-2/3 px-6 py-3 rounded-lg border-2 border-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                Search
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Listings Sections */}
      <div className="py-10 space-y-12">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {/* Each section now uses its own dedicated data state */}
            {recentlyListed.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold ml-5 mb-3">Recently Added</h2>
                <ListingsCategoryScroller listings={recentlyListed} />
              </div>
            )}
            {listingsInCity.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold ml-5 mb-3">Listings in Yaoundé</h2>
                <ListingsCategoryScroller listings={listingsInCity} />
              </div>
            )}
            {affordableListings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold ml-5 mb-3">Affordable Listings</h2>
                <ListingsCategoryScroller listings={affordableListings} />
              </div>
            )}
            {singleRoomListings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold ml-5 mb-3">Single Rooms</h2>
                <ListingsCategoryScroller listings={singleRoomListings} />
              </div>
            )}
            {apartmentListings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold ml-5 mb-3">Apartments</h2>
                <ListingsCategoryScroller listings={apartmentListings} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;