// src/components/ListingPreviewCard/ListingPreviewCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { EyeIcon, CurrencyDollarIcon as SolidCurrencyDollarIcon } from '@heroicons/react/24/solid'; // Using solid for bids

const ListingPreviewCard = ({
  listingId,
  title,
  location,
  price,
  image,
  currency = "FCFA", // Default currency
  // Tenant-specific
  isWishlisted,
  onWishlistClick,
  // Landlord-specific
  views,
  bids,
  isLandlordView = false,
}) => {
  const defaultImage = 'https://via.placeholder.com/300x200?text=No+Image';
  const displayPrice = price ? `${currency} ${Number(price).toLocaleString()}` : `${currency} N/A`;

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200 h-full flex flex-col group">
      <Link to={`/listingDetails?listingId=${listingId}`} className="block relative">
        <img
          src={image || defaultImage}
          alt={title}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 bg-primary-500 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow">
          {displayPrice}
        </div>
      </Link>

      {!isLandlordView && onWishlistClick && (
        <div
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md cursor-pointer z-10 hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistClick(listingId, isWishlisted);
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <AiFillHeart className="text-blue-600 text-xl" />
          ) : (
            <AiOutlineHeart className="text-gray-500 text-xl" />
          )}
        </div>
      )}

      {isLandlordView && (
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          {typeof views === 'number' && (
            <span className="bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
              <EyeIcon className="w-3.5 h-3.5" /> {views}
            </span>
          )}
          {typeof bids === 'number' && (
            <span className="bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
              <SolidCurrencyDollarIcon className="w-3.5 h-3.5" /> {bids}
            </span>
          )}
        </div>
      )}

      <div className="p-3 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-800 truncate mb-1 group-hover:text-blue-600 transition-colors">
            <Link to={`/listingDetails?listingId=${listingId}`} className="block">
              {title || "Untitled Listing"}
            </Link>
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {location || "No location specified"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingPreviewCard;