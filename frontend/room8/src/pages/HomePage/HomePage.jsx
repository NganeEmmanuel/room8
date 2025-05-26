import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ListingsCategoryScroller from "../../components/ListingCategoryScroller.jsx"
import mockListings from "../../mock/mock.js"
import heroImage from "../../assets/images/heroimage.png"

const HomePage = () => {
  const [listings, setListings] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    mockListings({}).then((data) => {
      setListings(data)
    })
  }, [])

  const handleSearch = () => {
    setLoading(true)
    setShowResults(false)

    setTimeout(() => {
      const results = listings.filter(listing => {
        const query = searchQuery.toLowerCase()
        return (
          listing.city?.toLowerCase().includes(query) ||
          listing.type?.toLowerCase().includes(query) ||
          listing.description?.toLowerCase().includes(query)
        )
      })

      setSearchResults(results)
      setLoading(false)
      setShowResults(true)
    }, 1000)
  }

  const listingsInCity = listings
  const affordableListings = listings
  const singleRoomListings = listings
  const apartmentListings = listings
  const studioListings = listings
  const recentlyListed = listings

  return (
    <>
      {/* Page Wrapper */}
      <div className="flex flex-col min-h-screen bg-gray-100">

        {/* Hero Section */}
        <section
          className="bg-fit bg-no-repeat bg-center text-black py-40 px-2"
          style={{ backgroundImage: `url(${heroImage})`, height: "80vh" }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Easily Find Rooms, Apartments and Roommates
            </h1>
            <p className="text-lg sm:text-2xl font-bold mb-6">
              Simple, Fast, Trusted by Renters & Landlords<br />
              Your Next Home is Waiting for You.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row justify-center items-center font-bold gap-3 mb-5 mt-20">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city or room type..."
                className="w-full sm:w-2/3 px-10 py-2 rounded-lg border-3 bg-gray-200 border-blue-600 focus:outline-none focus:border-blue-600"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
              >
                Search
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Search Results Section */}
      {loading && (
        <div className="text-center my-5">
          <p className="text-lg font-medium text-gray-700">Loading listings...</p>
        </div>
      )}

      {showResults && !loading && (
        <div className="py-6">
          <h2 className="text-2xl font-bold ml-5 mb-4">Search Results</h2>
          {searchResults.length > 0 ? (
            <ListingsCategoryScroller
              title=""
              listings={searchResults}
              filterType=""
              onSeeMore={() => {}}
            />
          ) : (
            <div className="text-center text-gray-500">No listings found.</div>
          )}
        </div>
      )}

      {/* Listings Sections */}
      <div className="pt-0 py-6 space-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h1 className="text-2xl font-bold ml-5">Listings in Your City</h1>
          <ListingsCategoryScroller
            title=""
            listings={listingsInCity}
            filterType="city"
            onSeeMore={() => console.log("See more city listings")}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold ml-5">Affordable Listings</h1>
          <ListingsCategoryScroller
            title=""
            listings={affordableListings}
            filterType="price"
            onSeeMore={() => console.log("See more affordable listings")}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold ml-5">Single Room Listings</h1>
          <ListingsCategoryScroller
            title=""
            listings={singleRoomListings}
            filterType="type"
            onSeeMore={() => console.log("See more single room listings")}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold ml-5">Apartment Listings</h1>
          <ListingsCategoryScroller
            title=""
            listings={apartmentListings}
            filterType="type"
            onSeeMore={() => console.log("See more apartment listings")}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold ml-5">Studio Listings</h1>
          <ListingsCategoryScroller
            title=""
            listings={studioListings}
            filterType="type"
            onSeeMore={() => console.log("See more studio listings")}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold ml-5">Recently Listed</h1>
          <ListingsCategoryScroller
            title=""
            listings={recentlyListed}
            filterType="dateListed"
            onSeeMore={() => console.log("See more recently listed")}
          />
        </div>
      </div>
    </>
  )
}

export default HomePage
