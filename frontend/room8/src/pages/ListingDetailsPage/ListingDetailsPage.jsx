import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

// Components
import ImageBanner from "./components/ImageBanner"
import SimilarListings from "./components/SimilarListings"
import BidsSection from "./components/BidsSection"
import WishlistToggle from "./components/WishlistToggle"
import PropertyDetails from "./components/PropertyDetails"

const ListingDetailsPage = () => {
  const [searchParams] = useSearchParams()
  const listingId = searchParams.get("listingId")
  const [listing, setListing] = useState(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem("accessToken")

  // Fetch listing data
  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchListing = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock data
          setListing({
            id: listingId || "123",
            title: "Studio modern",
            price: 50000,
            currency: "cfa",
            location: "Dispensaire Messasi - Yaounde",
            description:
              "This beautiful studio apartment is located in the heart of downtown. It features modern amenities, a spacious layout, and is close to public transportation, restaurants, and shopping.",
            images: ["/images/istockphoto.jpg"],
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
              {
                id: 1,
                user: { name: "sandra", avatar: "/images/istockphoto.jpg" },
                amount: 30000,
                currency: "cfa",
              },
              {
                id: 2,
                user: { name: "sandra", avatar: "/images/istockphoto.jpg" },
                amount: 30000,
                currency: "cfa",
              },
              {
                id: 3,
                user: { name: "sandra", avatar: "/images/istockphoto.jpg" },
                amount: 30000,
                currency: "cfa",
              },
            ],
            similarListings: [
              {
                id: "456",
                title: "Studio",
                location: "Dispensaire Messasi - Yaounde",
                price: 50000,
                currency: "cfa",
                image: "/images/istockphoto.jpg",
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

  const [showBidForm, setShowBidForm] = useState(false)

  const handlePlaceBidClick = () => {
  if (!isAuthenticated) {
    navigate("/login")
  } else {
    setShowBidForm(true)
  }
  }


  const handleBackToSearch = () => {
    navigate("/listings")
  }

  const handleAcceptBid = (bidId) => {
    console.log("Accepting bid:", bidId)
    // Here you would make an API call to accept the bid
  }

  const handleRejectBid = (bidId) => {
    console.log("Rejecting bid:", bidId)
    // Here you would make an API call to reject the bid
  }

  const handleToggleWishlist = (listingId) => {
    setIsWishlisted(!isWishlisted)
    console.log(`${isWishlisted ? "Removing from" : "Adding to"} wishlist:`, listingId)
    // Here you would make an API call to update the wishlist
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Listing Not Found</h2>
        <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate("/listings")}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Browse Listings
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Back Button */}
      <div className="mb-4">
        <button onClick={handleBackToSearch} className="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          <span>Back to Search</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2">
          {/* Image Banner */}
          <ImageBanner images={listing.images} />

          {/* Property Details with Wishlist Toggle */}
          <div className="flex justify-end mb-2">
            <WishlistToggle
              listingId={listing.id}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleToggleWishlist}
              isAuthenticated={isAuthenticated}
            />
          </div>

          {/* Property Details */}
          <PropertyDetails listing={listing} />

          {/* Similar Listings */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Similar to this listing</h2>
            <SimilarListings listings={listing.similarListings} />
          </div>
        </div>

       {/* Bids Section - Right Column */}
<div className="lg:col-span-1 w-full md:max-w-md mx-auto">
  <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-start h-full">
    <h2 className="text-xl font-semibold mb-4">Bids</h2>

    {!showBidForm ? (
      <button
        onClick={handlePlaceBidClick}
        className="mb-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Place a Bid
      </button>
    ) : (
      <>
        {/* Bid Input Form */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Enter your bid"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
          />
          <button
            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Submit Bid
          </button>
          <button
            onClick={() => setShowBidForm(false)}
            className="mt-2 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>

        {/* Bids List */}
        <BidsSection
          bids={listing.bids}
          onAccept={handleAcceptBid}
          onReject={handleRejectBid}
        />
      </>
    )}
  </div>

</div>

</div>
      </div>
  )
}

export default ListingDetailsPage
