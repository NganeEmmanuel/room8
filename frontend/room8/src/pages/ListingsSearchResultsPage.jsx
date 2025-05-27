// src/pages/ListingsSearchResultsPage.jsx
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ListingCard from "../components/ListingCard/ListingCard"
import mockListings from "../mock/mock.js"

const ListingsSearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  const searchTerm = searchParams.get("term") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const sort = searchParams.get("sort") || ""
  const filters = Object.fromEntries(searchParams.entries())

  useEffect(() => {
    setLoading(true)
    mockListings(filters).then((data) => {
      setListings(data)
      setLoading(false)
    })
  }, [searchParams])

  const totalResults = listings.length
  const resultsPerPage = 16
  const totalPages = Math.ceil(totalResults / resultsPerPage)
  const paginatedListings = listings.slice((page - 1) * resultsPerPage, page * resultsPerPage)

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(filters)
    newParams.set("sort", e.target.value)
    setSearchParams(newParams)
  }

  return (
    <div className="p-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-white">
          Results for "{searchTerm}" ({totalResults} found)
        </h1>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-300">Sort by:</label>
          <select
            id="sort"
            value={sort}
            onChange={handleSortChange}
            className="bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-600"
          >
            <option value="">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center text-gray-400">Loading listings...</div>
      ) : paginatedListings.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No listings found.</div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <a
              key={num}
              href={`?${new URLSearchParams({ ...filters, page: num }).toString()}`}
              className={`px-3 py-1 rounded border text-sm ${
                num === page ? "bg-blue-500 text-white" : "text-gray-300 border-gray-600 hover:bg-gray-700"
              }`}
            >
              {num}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListingsSearchResultsPage
