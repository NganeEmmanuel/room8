// src/components/ListingCard/ListingCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Changed FaLocationArrow to FaLocationDot as it's a more common location icon
import { FaBed, FaBath, FaUsers, FaUtensils, FaRulerCombined} from 'react-icons/fa'; // Added FaLocationDot
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { CurrencyDollarIcon as SolidCurrencyDollarIcon } from '@heroicons/react/24/solid';
import {FaLocationDot} from "react-icons/fa6";


const ListingCard = ({
  listingId,
  title,
  location,
  price,
  image,
  roomType,
  toilets,
  kitchen,
  roommates,
  rooms,
  size,
  views,
  bids,
  isWishlisted,
  onWishlistClick,
  isLandlordView = false,
  onEditListing,
  onDeleteListing,
}) => {
  const defaultImage = 'https://via.placeholder.com/400x250?text=No+Image';


  const cardLinkPath = `/listingDetails?listingId=${listingId}`;

  return (
    <div className="relative block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white w-full group border border-gray-200">
      <div className="relative">
        <Link to={cardLinkPath} className="block">
          <img
            src={image || defaultImage}
            alt={title || "Listing Image"}
            className="w-full h-48 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {!isLandlordView && onWishlistClick && (
          <div
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg cursor-pointer z-10 hover:bg-gray-100 transition-colors"
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
              <AiOutlineHeart className="text-gray-600 text-xl" />
            )}
          </div>
        )}

        {isLandlordView && (
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditListing?.(listingId); }}
              className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors"
              title="Edit Listing"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteListing?.(listingId); }}
              className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors"
              title="Delete Listing"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-gray-800 truncate pr-2 group-hover:text-blue-600 transition-colors">
            <Link to={cardLinkPath} className="block">
              {title || "Untitled Listing"}
            </Link>
          </h3>
          {roomType && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap font-medium">
              {roomType}
            </span>
          )}
        </div>

        {/* Replaced location emoji with FaLocationDot icon */}
        <p className="text-sm text-gray-500 truncate flex items-center gap-1">
          <FaLocationDot className="w-4 h-4 text-gray-400" /> {location || "No location"}
        </p>
        <p className="text-blue-600 font-bold text-xl">{price}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-600 pt-2 border-t border-gray-100 mt-2">

            <span className="flex items-center gap-1.5 truncate">
              <FaBed className="text-gray-400 w-4 h-4" /> {rooms} room{rooms !== 1 ? 's' : ''}
            </span>


            <span className="flex items-center gap-1.5 truncate">
              <FaBath className="text-gray-400 w-4 h-4" /> {toilets} toilet{toilets !== 1 ? 's' : ''}
            </span>


            <span className="flex items-center gap-1.5 truncate">
              <FaUsers className="text-gray-400 w-4 h-4" /> {roommates} roommate{roommates !== 1 ? 's' : ''}
            </span>


            <span className="flex items-center gap-1.5 truncate">
              <FaUtensils className="text-gray-400 w-4 h-4" /> {kitchen} kitchen{kitchen !== 1 ? 's' : ''}
            </span>


            <span className="flex items-center gap-1.5 truncate col-span-2 sm:col-span-1">
              <FaRulerCombined className="text-gray-400 w-4 h-4" /> {size}
            </span>

        </div>

        {isLandlordView && (
          <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-100 pt-3 mt-3">
            <span className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4 text-gray-400" /> Views: <span className="font-semibold">{views || 0}</span>
            </span>
            <span className="flex items-center gap-1">
              <SolidCurrencyDollarIcon className="w-4 h-4 text-gray-400" /> Bids: <span className="font-semibold">{bids || 0}</span>
            </span>
          </div>
        )}
      </div>
    </div>
    );
};

export default ListingCard;