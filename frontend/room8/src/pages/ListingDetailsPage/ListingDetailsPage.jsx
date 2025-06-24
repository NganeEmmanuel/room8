// src/pages/listing/ListingDetailsPage.jsx

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import ImageBanner from "./components/ImageBanner"
import SimilarListings from "./components/SimilarListings"
import WishlistToggle from "./components/WishlistToggle"
import PropertyDetails from "./components/PropertyDetails"
import istockphoto from "../../assets/images/istockphoto.jpg"
import Spinner from "./components/Spinner.jsx";
// ADDED: Import the new sliding panel component
import PlaceBidPanel from "../../components/bids/PlaceBidPanel.jsx";
import {useBids} from "../../context/BidContext.jsx";

const ListingDetailsPage = () => {
  const [searchParams] = useSearchParams()
  const listingId = searchParams.get("listingId")
  const [listing, setListing] = useState(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // CHANGED: State is now for the panel, not an inline form
  const [isBidPanelOpen, setIsBidPanelOpen] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem("accessToken")

  const { addBid } = useBids(); // Get the addBid function from the context

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true)
      try {
        setTimeout(() => {
          setListing({
            id: listingId || "123",
            title: "Studio modern",
            price: 50000,
            currency: "FCFA",
            location: "Dispensaire Messasi - Yaounde",
            description:
              "This beautiful studio apartment is located in the heart of downtown...",
            images: [istockphoto],
            roomType: "Studio",
            amenities: ["WiFi", "Laundry", "Kitchen", "Parking", "Air Conditioning"],
            rooms: 3,
            toilet: 1,
            kitchen: 1,
            roommates: 2,
            squareFt: 400,
            availableFrom: "2023-08-01",
            petFriendly: true,
            furnished: true,
            bids: [
              { id: 1, user: { name: "Sandra", avatar: istockphoto }, proposal: "I am interested", shareUserInfo: true },
              { id: 2, user: { name: "Mike", avatar: istockphoto }, proposal: "I would like to apply", shareUserInfo: false },
            ],
             landlord: { id: "landlordMain", name: "Mock Landlord Name" }, // Added landlord info
            similarListings: [
              {
                id: "456",
                title: "Studio",
                location: "Dispensaire Messasi - Yaounde",
                price: 50000,
                currency: "FCFA",
                image: istockphoto,
                rooms: 3,
                toilet: 1,
                kitchen: 1,
                roommates: 2,
                squareFt: 400,
              },
            ],
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching listing:", error)
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [listingId])

  const handlePlaceBidClick = () => {
    if (!isAuthenticated) {
     // navigate("/login")
      setIsBidPanelOpen(true)
    } else {
      // CHANGED: This now opens the panel
      setIsBidPanelOpen(true)
    }
  }

  // ADDED: A handler to process the data from the PlaceBidPanel
  const handleBidSubmit = ({ amount, proposal, shareUserInfo }) => {
    // This is the new bid object that matches the structure in our context
    const newBid = {
      id: `bid_${Date.now()}`,
      ListingId: listing.id,
      listingTitle: listing.title,
      bidderId: "userYouTenant", // This should come from your auth system
      landlordId: listing.landlord.id, // Get landlordId from listing data
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
        userInfo:
           { occupation: 'Software Engineer', employmentStatus: 'Employed', nationality: 'Canadian', languagesSpoken: ['English', 'French'],
             smokingStatus: 'Non-smoker', addictionStatus: 'None', hasPets: false, petPreference: 'None', petsAllowed: [], dietaryRestrictions: 'None',
             otherDietaryRestrictions: [], cleanlinessLevel: 'Very Tidy', sleepSchedule: 'Early Bird', comfortableWithGuests: 'Yes, with notice', partyHabits: 'Rarely', sharesFood: 'Sometimes, please ask',
             preferredRoomTemperature: 'Moderate', willingToShareBathroom: true, hasMedicalConditions: true, medicalConditions: ['Pollen Allergy'], isDisabled: false,
             disability: 'None', personalityType: 'Introvert', noiseTolerance: 'Prefers quiet', enjoysSocializingWithRoommates: 'Occasionally', willingToSplitUtilities: true,
            monthlyIncome: 6000, incomeCurrency: 'FCFA',
           }
      }
    };

    addBid(newBid); // This updates the GLOBAL state

    alert("Your bid has been submitted successfully!");
    setIsBidPanelOpen(false);

    // Optional: navigate to the bids page to see the result
    navigate('/admin/tenant/bids');
  };


  const handleBackToSearch = () => {
    navigate("/search")
  }



  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  if (isLoading) {
    return <Spinner />
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
    )
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
        {/* Left Side */}
        <div className="md:w-2/3 w-full">
          {/* Mobile-only: Top-right buttons */}
          <div className="flex justify-end gap-2 mb-2 md:hidden">
            <button
              onClick={handlePlaceBidClick}
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600"
            >
              Place a Bid
            </button>
            <WishlistToggle
              listingId={listing.id}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleToggleWishlist}
              isAuthenticated={isAuthenticated}
            />
          </div>

          <ImageBanner images={listing.images} />

          <div className="hidden md:flex justify-end my-2">
            <WishlistToggle
              listingId={listing.id}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleToggleWishlist}
              isAuthenticated={isAuthenticated}
            />
          </div>

          <PropertyDetails listing={listing} />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Similar to this listing</h2>
            <SimilarListings listings={listing.similarListings} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:w-1/3 w-full">
            <h2 className="text-xl font-semibold mb-4">Bids</h2>

            {/* REMOVED: The old inline bid form is gone */}

            {/* This button is always visible now (on desktop) */}
            <button
              onClick={handlePlaceBidClick}
              className="mb-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hidden md:block"
            >
              Place a Bid
            </button>

            {/*<BidsSection*/}
            {/*  bids={listing.bids}*/}
            {/*  onAccept={handleAcceptBid}*/}
            {/*  onReject={handleRejectBid}*/}
            {/*/>*/}
        </div>
      </div>

      {/* ADDED: The PlaceBidPanel is now rendered here, controlled by state */}
      <PlaceBidPanel
          isOpen={isBidPanelOpen}
          onClose={() => setIsBidPanelOpen(false)}
          onSubmit={handleBidSubmit}
          listingTitle={listing.title}
      />
    </div>
  )
}

export default ListingDetailsPage