import { Link } from "react-router-dom";
import { FaBath, FaBed, FaRulerCombined, FaUsers, FaUtensils } from "react-icons/fa";
import React from "react";

const SimilarListings = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-500">No similar listings available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => {
        // Destructure values from each listing for easy use
        const { rooms, toilets, roommates, kitchen, size, price, currency, id, title, location } = listing;

        return (
          <div key={id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
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
                {location}
              </p>

              <div className="grid grid-cols-5 gap-2 mb-3">
                <span className="flex items-center gap-1 truncate">
                  <FaBed className="text-gray-400" /> {rooms} rooms
                </span>
                <span className="flex items-center gap-1 truncate">
                  <FaBath className="text-gray-400" /> {toilets} toilets
                </span>
                <span className="flex items-center gap-1 truncate">
                  <FaUsers className="text-gray-400" /> {roommates} roommates
                </span>
                <span className="flex items-center gap-1 truncate">
                  <FaUtensils className="text-gray-400" /> {kitchen} kitchen
                </span>
                <span className="flex items-center gap-1 truncate col-span-2 sm:col-span-1">
                  <FaRulerCombined className="text-gray-400" /> {size}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-blue-500 font-semibold">
                  {price.toLocaleString()} {currency} /per month
                </p>
                <Link
                  to={`/listingDetails?listingId=${id}`}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimilarListings;
