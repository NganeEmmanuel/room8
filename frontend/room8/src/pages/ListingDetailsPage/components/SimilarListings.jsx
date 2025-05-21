import { Link } from "react-router-dom"
import { HomeIcon, UserGroupIcon, BeakerIcon } from "@heroicons/react/24/outline"

const SimilarListings = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-500">No similar listings available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div key={listing.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
            <p className="text-gray-600 text-sm flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {listing.location}
            </p>

            <div className="grid grid-cols-5 gap-2 mb-3">
              <div className="flex items-center">
                <HomeIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">{listing.rooms}</span>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-sm">{listing.toilet}</span>
              </div>

              <div className="flex items-center">
                <BeakerIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">{listing.kitchen}</span>
              </div>

              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">{listing.roommates}</span>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                  />
                </svg>
                <span className="text-sm">{listing.squareFt}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-blue-500 font-semibold">
                {listing.price.toLocaleString()} {listing.currency} /per month
              </p>
              <Link
                to={`/listingDetails?listingId=${listing.id}`}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SimilarListings

