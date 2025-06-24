// src/pages/listing/ListingDetailsPage.jsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ImageBanner from "./components/ImageBanner";
import SimilarListings from "./components/SimilarListings";
import PropertyDetails from "./components/PropertyDetails";
import Spinner from "./components/Spinner.jsx";
import PlaceBidPanel from "../../components/bids/PlaceBidPanel.jsx";
import { useListingService } from "../../services/useListingService.js";
import {useBidService} from "../../services/useBidService.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

const ListingDetailsPage = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getListingById } = useListingService();
  const { addBid } = useBidService(); // <-- Use the new hook
  const { isAuthenticated } = useAuth();

  const [listing, setListing] = useState(location.state?.listingData || null);
  const [isLoading, setIsLoading] = useState(!listing);
  const [isBidPanelOpen, setIsBidPanelOpen] = useState(false);

  useEffect(() => {
    if (listing) {
      window.scrollTo(0, 0);
      return;
    }

    const fetchListing = async () => {
      if (!listingId) { navigate("/"); return; }
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

   const handleBidSubmit = async (bidDataFromPanel) => {
    try {
      // The addBid service now handles auth checks, DTO creation, and API calls.
      await addBid(bidDataFromPanel, listing.id);
      setIsBidPanelOpen(false);
      // Navigate to the user's bid management page to see their new bid
      navigate('/admin/tenant/bids');
    } catch (error) {
      // The service already shows a toast, but we can log it here.
      console.error("Failed to submit bid:", error);
    }
  };
   const handlePlaceBidClick = () => {
    // Ensure user is logged in before opening the panel
    if (!isAuthenticated) {
      // You can redirect to login or show a toast message
      navigate('/login', { state: { from: location } }); // Redirect to login, but remember where they came from
      return;
    }
    setIsBidPanelOpen(true);
  };

  if (isLoading) return <Spinner />;

  if (!listing) {
    return <div className="text-center p-8">Listing not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:underline">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-8">
        {/* Left Side */}
        <div className="lg:w-2/3 w-full">

          {/* --- DATA MAPPING FIX in action --- */}
          <ImageBanner images={listing.imageUrls} />

          <div className="mt-6">
            <PropertyDetails
              title={listing.title}
              price={listing.listingPrice}
              currency="FCFA"
              location={`${listing.listingCity}, ${listing.listingState}`}
              rooms={listing.numberOfRooms}
              toilet={listing.numberOfBathrooms}
              kitchen={listing.numberOfKitchens}
              roommates={listing.numberOfHouseMates}
              squareFt={listing.roomArea ? `${listing.roomArea} sqm` : 'N/A'}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Similar Listings</h2>
            {/* <SimilarListings listings={listing.similarListings} /> */}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-1/3 w-full">
          <div className="sticky top-24 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interested?</h2>
            <p className="text-gray-600 mb-4">Place a bid to show your interest and get in contact with the landlord.</p>
            <button

             onClick={handlePlaceBidClick}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow"
            >
              Place a Bid
            </button>
          </div>
        </div>
      </div>

      <PlaceBidPanel
        isOpen={isBidPanelOpen}
        onClose={() => setIsBidPanelOpen(false)}
        onSubmit={handleBidSubmit} // <-- Pass the updated handler
        listingTitle={listing.title}
      />
    </div>
  );
};

export default ListingDetailsPage;