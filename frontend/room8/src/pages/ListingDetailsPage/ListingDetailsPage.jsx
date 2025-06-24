// src/pages/listing/ListingDetailsPage.jsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ImageBanner from "./components/ImageBanner";
import SimilarListings from "./components/SimilarListings";
import WishlistToggle from "./components/WishlistToggle";
import PropertyDetails from "./components/PropertyDetails";
import Spinner from "./components/Spinner.jsx";
import PlaceBidPanel from "../../components/bids/PlaceBidPanel.jsx";
import { useListingService } from "../../services/useListingService.js";

const ListingDetailsPage = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getListingById } = useListingService();

  const [listing, setListing] = useState(location.state?.listingData || null);
  const [isLoading, setIsLoading] = useState(!listing);
  const [isBidPanelOpen, setIsBidPanelOpen] = useState(false);

  useEffect(() => {
    if (listing) return;

    const fetchListing = async () => {
      if (!listingId) {
        navigate("/");
        return;
      }
      setIsLoading(true);
      try {
        const data = await getListingById(listingId);
        setListing(data);
      } catch (error) {
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [listingId, listing, navigate, getListingById]);

  const handleBackToSearch = () => {
    navigate("/search");
  };

  const handlePlaceBidClick = () => {
    setIsBidPanelOpen(true);
  };

  const handleBidSubmit = (bidData) => {
    console.log("Submitted bid:", bidData);
    setIsBidPanelOpen(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Listing Not Found</h2>
        <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={handleBackToSearch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Browse Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-1">
      <div className="mb-4">
        <button
          onClick={handleBackToSearch}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          <span>Back to Search</span>
        </button>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Left Side */}
        <div className="md:w-2/3 w-full">
          <div className="flex justify-end gap-2 mb-2 md:hidden">
            <button
              onClick={handlePlaceBidClick}
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600"
            >
              Place a Bid
            </button>
          </div>

          <ImageBanner images={listing.images} />
          <PropertyDetails listing={listing} />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Similar to this listing</h2>
            <SimilarListings listings={listing.similarListings} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:w-1/3 w-full">
          <h2 className="text-xl font-semibold mb-4">Bids</h2>

          <button
            onClick={handlePlaceBidClick}
            className="mb-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hidden md:block"
          >
            Place a Bid
          </button>

          {/* Future BidsSection goes here */}
        </div>
      </div>

      <PlaceBidPanel
        isOpen={isBidPanelOpen}
        onClose={() => setIsBidPanelOpen(false)}
        onSubmit={handleBidSubmit}
        listingTitle={listing.title}
      />
    </div>
  );
};

export default ListingDetailsPage;
