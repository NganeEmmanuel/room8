import React from 'react';

const PropertyDetails = ({ listing }) => {
  const {
    title,
    price,
    currency,
    location,
    rooms,
    toilet,
    kitchen,
    roommates,
    squareFt,
  } = listing;

  return (
    <div className="mt-4">
      {/* Title and Location */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex space-x-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
              FIRST FLOOR
            </span>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
              AVAILABLE
            </span>
          </div>
        </div>
        <p className="text-gray-600 mt-1">📍 {location}</p>
      </div>

      {/* Property Features (Emoji style) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700 mb-6">
        <p>🛏️ <strong>{rooms}</strong> rooms</p>
        <p>🚿 <strong>{toilet}</strong> toilets</p>
        <p>🍳 <strong>{kitchen}</strong> kitchen</p>
        <p>👫 <strong>{roommates}</strong> roommates</p>
        <p>📏 <strong>{squareFt}</strong></p>
      </div>

      {/* Price and Actions */}
      <div className="flex flex-wrap items-center justify-between mt-4 pb-4 border-b border-gray-200">
        <p className="text-blue-500 font-bold text-lg">
          {price.toLocaleString()} {currency} /per month
        </p>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Message
          </button>
          <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
            Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
