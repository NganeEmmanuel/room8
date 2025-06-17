// src/components/ListingsCategoryScroller.jsx
import { useRef } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import ListingCard from "./ListingCard/ListingCard"
import Spinner from "../pages/ListingDetailsPage/components/Spinner.jsx";

const ListingsCategoryScroller = ({ title, listings = [], onSeeMore }) => {
  const scrollRef = useRef(null)

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
  }

  const isLoading = listings === null
  const hasListings = listings.length > 0

  return (
    <div className="my-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button onClick={onSeeMore} className="text-sm text-blue-500 hover:underline">
          See More
        </button>
      </div>

      {/* Loader */}
      {isLoading && <div className="text-center text-gray-400 py-10"><Spinner /></div>}

      {/* Empty State */}
      {!isLoading && !hasListings && (
       <Spinner />
      )}

      {/* Scrollable Listings */}
      {hasListings && (
        <div className="relative">
          {/* Scroll buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 shadow-md"
            onClick={scrollLeft}
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-scroll scrollbar-none scroll-smooth px-8 py-2"
            style={{scrollbarWidth: "none"}}
          >
            {listings.map((listing, index) => (
              <div key={index} className="min-w-[250px] flex-shrink-0">
                <ListingCard {...listing} />
              </div>
            ))}
          </div>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 shadow-md"
            onClick={scrollRight}
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-800" />
          </button>
        </div>
      )}
    </div>
  )
}

export default ListingsCategoryScroller
