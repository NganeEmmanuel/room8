// src/pages/listing/components/PropertyDetails.jsx

import React from 'react';
import { FaBed, FaBath, FaUsers, FaUtensils, FaRulerCombined } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";

const PropertyDetails = ({
  title,
  price,
  currency,
  location,
  rooms,
  toilet,
  kitchen,
  roommates,
  squareFt,
}) => {
  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow">
      {/* Title and Location */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <div className="flex space-x-2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              AVAILABLE
            </span>
          </div>
        </div>
        <span className="flex items-center gap-2 text-gray-500 mt-2">
          <FaLocationDot /> {location}
        </span>
      </div>

      {/* Price */}
      <div className="my-4">
        <p className="text-blue-600 font-bold text-2xl">
          {/* Format the price here with a fallback */}
          {typeof price === 'number' ? price.toLocaleString() : 'Price not available'} {currency} /per month
        </p>
      </div>

      {/* Property Features */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-2 text-sm text-gray-600">
        <span className="flex items-center gap-2"><FaBed className="text-gray-400" /> {rooms || 0} rooms</span>
        <span className="flex items-center gap-2"><FaBath className="text-gray-400" /> {toilet || 0} toilets</span>
        <span className="flex items-center gap-2"><FaUsers className="text-gray-400" /> {roommates || 0} roommates</span>
        <span className="flex items-center gap-2"><FaUtensils className="text-gray-400" /> {kitchen || 0} kitchen</span>
        <span className="flex items-center gap-2"><FaRulerCombined className="text-gray-400" /> {squareFt || 'N/A'}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200">
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow">
          Message Landlord
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
          Email
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;