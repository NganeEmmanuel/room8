import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ListingCard from "../components/ListingCard/ListingCard"
import mockListings from "../mock/mock.js"
import Spinner from "./ListingDetailsPage/components/Spinner.jsx"
import FilterSidebar from "../components/FilterSidebar"

const ListingsSearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [sort, setSort] = useState("")
  const [term, setTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [allRoomTypes, setAllRoomTypes] = useState([])

  useEffect(() => {
    mockListings().then((all) => {
      const types = [...new Set(all.map((l) => l.roomType))]
      setAllRoomTypes(types)
    })
  }, [])

  useEffect(() => {
    setTerm(searchParams.get("term") || "")
    setPriceMin(searchParams.get("priceMin") || "")
    setPriceMax(searchParams.get("priceMax") || "")
    setSort(searchParams.get("sort") || "")
    const rt = searchParams.get("roomTypes")
    setSelectedRoomTypes(rt ? rt.split(",") : [])
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    const filters = { term, priceMin, priceMax, sort }

    mockListings(filters).then((data) => {
      let filtered = data
      if (selectedRoomTypes.length) {
        filtered = filtered.filter((l) => selectedRoomTypes.includes(l.roomType))
      }
      setListings(filtered)
      setLoading(false)
    })
  }, [term, priceMin, priceMax, sort, selectedRoomTypes])

  const applyFilters = () => {
    const params = {}
    if (term.trim()) params.term = term.trim()
    if (priceMin) params.priceMin = priceMin
    if (priceMax) params.priceMax = priceMax
    if (sort) params.sort = sort
    if (selectedRoomTypes.length) params.roomTypes = selectedRoomTypes.join(",")
    params.page = 1
    setSearchParams(params)
    setIsFilterOpen(false)
  }

  const toggleRoomType = (type) => {
    setSelectedRoomTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  // Pagination
  const page = parseInt(searchParams.get("page") || "1", 10)
  const resultsPerPage = 16
  const totalResults = listings.length
  const totalPages = Math.ceil(totalResults / resultsPerPage)
  const paginatedListings = listings.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  )

  const goToPage = (newPage) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev.entries())
      params.page = newPage
      return params
    })
  }

  // Lock scroll when mobile filter is open
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : ""
  }, [isFilterOpen])

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block w-64 sticky top-[60px] h-[calc(100vh-60px)] border-r bg-white shadow z-10">
        <FilterSidebar
          roomTypes={allRoomTypes}
          selectedTypes={selectedRoomTypes}
          onToggleRoomType={toggleRoomType}
          priceMin={priceMin}
          setPriceMin={setPriceMin}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          sort={sort}
          setSort={setSort}
          onApply={applyFilters}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search bar (sticky) */}
        <div className="sticky top-0 z-30 bg-white px-4 py-3 border-b shadow-sm flex items-center gap-3">
          <button
            className="md:hidden px-3 py-2 bg-blue-600 text-white rounded"
            onClick={() => setIsFilterOpen(true)}
          >
            Filters
          </button>
          <input
            type="text"
            placeholder="Search listings..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="flex-grow px-3 py-2 border border-gray-300 rounded focus:outline-blue-600"
          />
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Page Content */}
        <div className="px-4 py-6">
          <h1 className="text-xl font-semibold mb-4">
            {term || priceMin || priceMax || selectedRoomTypes.length
              ? `Results (${totalResults})`
              : `Recently Listed (${totalResults})`}
          </h1>

          {/* Listings */}
          {loading ? (
            <Spinner />
          ) : paginatedListings.length ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedListings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No listings found.</p>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                &lt;
              </button>
              <span className="text-gray-700 font-medium">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-40 bg-blue-50 bg-opacity-25 md:hidden">
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 overflow-y-auto">
            <FilterSidebar
              roomTypes={allRoomTypes}
              selectedTypes={selectedRoomTypes}
              onToggleRoomType={toggleRoomType}
              priceMin={priceMin}
              setPriceMin={setPriceMin}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              sort={sort}
              setSort={setSort}
              onApply={applyFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ListingsSearchResultsPage
