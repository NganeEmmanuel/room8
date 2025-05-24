import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

function ListingCard({
  listingId,
  title,
  location,
  price,
  image,
  roomType,
  isWishlisted,
  toilets,
  kitchen,
  roommates,
  rooms,
  size,
  onWishlistClick,
}) {
  return (
    <div className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transition-transform bg-white max-w-full">
      {/* Image */}
      <div className="relative">
        <Link to={`/listingDetails?listingId=${listingId}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-48 sm:h-52 md:h-56 object-cover"
          />
        </Link>
        <div
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistClick?.(listingId, isWishlisted);
          }}
        >
          {isWishlisted ? (
            <AiFillHeart className="text-blue-500 text-xl" />
          ) : (
            <AiOutlineHeart className="text-blue-500 text-xl" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate max-w-[75%]">
            {title}
          </h3>
          <span className="text-xs sm:text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded whitespace-nowrap">
            {roomType}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">{location}</p>
        <p className="text-blue-600 font-bold mb-2 text-sm sm:text-base">{price}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
          <span className="truncate">🛏️ {rooms} rooms</span>
          <span className="truncate">🚿 {toilets} toilets</span>
          <span className="truncate">👫 {roommates} roommates</span>
          <span className="truncate">🍳 {kitchen} kitchen</span>
          <span className="truncate col-span-2 sm:col-span-1">📏 {size}</span>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
