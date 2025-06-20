import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon, StarIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import ImageBanner from "./components/ImageBanner";
import SimilarListings from "./components/SimilarListings";
import WishlistToggle from "./components/WishlistToggle";
import PropertyDetails from "./components/PropertyDetails";
import Spinner from "./components/Spinner.jsx";
import PlaceBidPanel from "../../components/bids/PlaceBidPanel.jsx";
import { useBids } from "../../context/BidContext.jsx";
import { toast } from "react-toastify";
import { useReviews } from "../../context/ReviewContext";
import AddReviewPanel from "../../components/reviews/AddReviewPanel";
import { MOCK_LISTINGS_DB } from "../admin/ManageListings/mockData"; // --- CORRECTED: Import the real listing data ---

const CURRENT_USER_ID = "user123";

const ListingDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listingId");
  const [listing, setListing] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBidPanelOpen, setIsBidPanelOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const { addBid } = useBids();
  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const { reviews, addReview } = useReviews();
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userReviewId, setUserReviewId] = useState(null);
  const [listingReviews, setListingReviews] = useState([]);

  useEffect(() => {
    const fetchListingAndProcessReviews = () => {
      setIsLoading(true);

      setTimeout(() => {
        // --- CORRECTED: Find the listing from the single source of truth ---
        const foundListing = MOCK_LISTINGS_DB.find(l => l.id === listingId);

        if (foundListing) {
          setListing(foundListing);

          // Process reviews from the global context state
          const filteredReviews = reviews.filter(r => r.listingId === foundListing.id);
          setListingReviews(filteredReviews);

          const existingUserReview = filteredReviews.find(r => r.userId === CURRENT_USER_ID);
          if (existingUserReview) {
            setUserHasReviewed(true);
            setUserReviewId(existingUserReview.id);
          } else {
            setUserHasReviewed(false);
            setUserReviewId(null);
          }
        } else {
          toast.error("Listing not found!");
          navigate("/");
        }
        setIsLoading(false);
      }, 1000); // Simulating network delay
    };

    if (listingId) {
      fetchListingAndProcessReviews();
    } else {
        toast.error("No listing ID provided.");
        navigate("/");
    }
  }, [listingId, navigate, reviews]);

  const handlePlaceBidClick = () => {
    if (!isAuthenticated) {
      setIsBidPanelOpen(true);
    } else {
      setIsBidPanelOpen(true);
    }
  };

  const handleBidSubmit = ({ amount, proposal, shareUserInfo }) => {
    const newBid = {
      id: `bid_${Date.now()}`,
      ListingId: listing.id,
      listingTitle: listing.title,
      bidderId: "userYouTenant",
      landlordId: listing.landlord.id,
      landlordName: listing.landlord.name,
      proposal,
      amount,
      currency: "FCFA",
      status: "pending",
      bidDate: new Date().toISOString(),
      shareUserInfo,
      bidderInfo: {
        name: "You (Tenant)",
        email: "tenant@example.com",
        phoneNumber: "555-123-4567",
        profileImage: "https://i.pravatar.cc/150?u=tenantYou",
        userInfo: { occupation: 'Software Engineer', employmentStatus: 'Employed', nationality: 'Canadian', languagesSpoken: ['English', 'French'], smokingStatus: 'Non-smoker', addictionStatus: 'None', hasPets: false, petPreference: 'None', petsAllowed: [], dietaryRestrictions: 'None', otherDietaryRestrictions: [], cleanlinessLevel: 'Very Tidy', sleepSchedule: 'Early Bird', comfortableWithGuests: 'Yes, with notice', partyHabits: 'Rarely', sharesFood: 'Sometimes, please ask', preferredRoomTemperature: 'Moderate', willingToShareBathroom: true, hasMedicalConditions: true, medicalConditions: ['Pollen Allergy'], isDisabled: false, disability: 'None', personalityType: 'Introvert', noiseTolerance: 'Prefers quiet', enjoysSocializingWithRoommates: 'Occasionally', willingToSplitUtilities: true, monthlyIncome: 6000, incomeCurrency: 'FCFA' }
      }
    };
    addBid(newBid);
    toast.success("Your bid has been submitted successfully!");
    setIsBidPanelOpen(false);
    navigate('/admin/tenant/bids');
  };

  const handleReviewSubmit = (reviewData) => {
    const newReviewPayload = {
      ...reviewData,
      listingId: listing.id,
      userId: CURRENT_USER_ID,
      authorName: "Current User",
    };
    addReview(newReviewPayload);
    toast.success("Thank you! Your review has been submitted.");
    setIsReviewPanelOpen(false);
  };

  const handleBackToSearch = () => {
    navigate("/search");
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
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
        <button onClick={handleBackToSearch} className="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          <span>Back to Search</span>
        </button>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-6">
        <div className="md:w-2/3 w-full">
          <div className="flex justify-end gap-2 mb-2 md:hidden">
            <button onClick={handlePlaceBidClick} className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600">
              Place a Bid
            </button>
            <WishlistToggle listingId={listing.id} isWishlisted={isWishlisted} onToggleWishlist={handleToggleWishlist} isAuthenticated={isAuthenticated} />
          </div>
          <ImageBanner images={listing.imagePreviews} />
          <div className="hidden md:flex justify-end my-2">
            <WishlistToggle listingId={listing.id} isWishlisted={isWishlisted} onToggleWishlist={handleToggleWishlist} isAuthenticated={isAuthenticated} />
          </div>
          <PropertyDetails listing={listing} />
          <div className="mt-8 bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Guest Reviews ({listingReviews.length})</h2>
              {userHasReviewed ? (
                <button
                  disabled
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 cursor-not-allowed"
                >
                  <StarIcon className="w-5 h-5 mr-2" />
                  Review Submitted
                </button>
              ) : (
                <button
                  onClick={() => setIsReviewPanelOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PencilSquareIcon className="w-5 h-5 mr-2" />
                  Write a Review
                </button>
              )}
            </div>
            <div className="space-y-6">
              {listingReviews.length > 0 ? listingReviews.map(review => (
                <div key={review.id} className="border-t pt-6">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-gray-800 mr-4">{review.authorName}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`h-5 w-5 ${review.rating > i ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              )) : (
                <p className="text-gray-500">Be the first to leave a review!</p>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Similar to this listing</h2>
            <SimilarListings listings={listing.similarListings || []} />
          </div>
        </div>
        <div className="md:w-1/3 w-full">
          <h2 className="text-xl font-semibold mb-4">Bids</h2>
          <button onClick={handlePlaceBidClick} className="mb-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hidden md:block">
            Place a Bid
          </button>
        </div>
      </div>
      <PlaceBidPanel
        isOpen={isBidPanelOpen}
        onClose={() => setIsBidPanelOpen(false)}
        onSubmit={handleBidSubmit}
        listingTitle={listing.title}
      />
      <AddReviewPanel
        isOpen={isReviewPanelOpen}
        onClose={() => setIsReviewPanelOpen(false)}
        onSubmit={handleReviewSubmit}
        listingTitle={listing.title}
      />
    </div>
  );
};

export default ListingDetailsPage;