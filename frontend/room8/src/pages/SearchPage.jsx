// src/pages/SearchPage.jsx
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import ListingCard from "../components/ListingCard/ListingCard"
import mockListings from "../mock/mock.js"
import Spinner from "./ListingDetailsPage/components/Spinner.jsx";

const SearchPage = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchTerm = searchParams.get("term") || ""

  useEffect(() => {
    setLoading(true)
    mockListings({}).then((data) => {
      setListings(data)
      setLoading(false)
    })
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/listings/search/${searchTerm}?page=1`)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchParams({ term: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded w-full sm:w-1/2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      <h1 className="text-xl font-semibold mb-4">Recently Listed</h1>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.slice(0, 16).map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
