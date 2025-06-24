// src/pages/HomePage.jsx

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ListingsCategoryScroller from "../../components/ListingCategoryScroller.jsx";
import { useSearchService } from "../../services/useSearchService.js";
import heroImage from "../../assets/images/heroimage.png";

const HomePage = () => {
  const [recentListings, setRecentListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { searchListingsWithFilter } = useSearchService();

  // Fetch the most recent listings when the component loads
  const fetchInitialListings = useCallback(async () => {
    try {

      const data = await searchListingsWithFilter({}, 0, 10);
      setRecentListings(data);
    } catch (error) {
      console.error("Failed to fetch initial listings:", error);
    }
  }, [searchListingsWithFilter]);

  useEffect(() => {
    fetchInitialListings();
  }, [fetchInitialListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // --- THIS IS THE FIX ---
    // The placeholder says "Enter city...", so we navigate using the 'city' parameter
    // which your backend is specifically designed to handle.
    navigate(`/search?city=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <section
          className="bg-fit bg-no-repeat bg-center text-black py-40 px-2"
          style={{ backgroundImage: `url(${heroImage})`, height: "80vh" }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-600">
              Easily Find Rooms, Apartments and Roommates
            </h1>
            <p className="text-md sm:text-2xl font-medium mb-6 text-gray-500">
              Simple, Fast, Trusted by Renters & Landlords<br />
              Your Next Home is Waiting for You.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center items-center font-bold gap-3 mb-5 mt-20">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city to search rooms..."
                className="w-full sm:w-2/3 px-10 py-2 rounded-lg border bg-gray-100 border-gray-300 focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
              >
                Search
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* This section now reliably shows your newest listings */}
      <div className="pt-0 py-6 space-y-10">
        {recentListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center ml-5 mr-5 mb-2">
                <h1 className="text-2xl font-bold">Recently Added Listings</h1>
                <a href="listings/search:term" className="text-blue-600 hover:underline">See all</a>
            </div>
            <ListingsCategoryScroller listings={recentListings} />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;