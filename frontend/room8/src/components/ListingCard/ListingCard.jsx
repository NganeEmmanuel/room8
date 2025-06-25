// src/components/ListingCard/ListingCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaUsers, FaUtensils, FaRulerCombined } from 'react-icons/fa';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { CurrencyDollarIcon as SolidCurrencyDollarIcon } from '@heroicons/react/24/solid';
import { FaLocationDot } from "react-icons/fa6";

const ListingCard = ({
    listing, // <-- ADD THIS PROP TO RECEIVE THE FULL OBJECT
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
    // The link path now uses a cleaner URL parameter
    const cardLinkPath = `/listingDetails/${listingId}`;

    return (
        <div className="relative block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white w-full group border border-gray-200">
            {/* The Link now wraps the main content and passes the full listing object in its `state` prop */}
            <Link to={cardLinkPath} state={{ listingData: listing }}>
                <div className="relative">
                    <img
                        src={image || defaultImage}
                        alt={title || "Listing Image"}
                        className="w-full h-48 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-gray-800 truncate pr-2 group-hover:text-blue-600 transition-colors">
                            {title || "Untitled Listing"}
                        </h3>
                        {roomType && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap font-medium">
                                {roomType}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                        <FaLocationDot className="w-4 h-4 text-gray-400" /> {location || "No location"}
                    </p>
                    <p className="text-blue-600 font-bold text-xl">{price ? `${price} FCFA` : 'N/A'}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-600 pt-2 border-t border-gray-100 mt-2">
                        <span className="flex items-center gap-1.5 truncate"><FaBed className="text-gray-400 w-4 h-4" /> {rooms} room{rooms !== 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-1.5 truncate"><FaBath className="text-gray-400 w-4 h-4" /> {toilets} toilet{toilets !== 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-1.5 truncate"><FaUsers className="text-gray-400 w-4 h-4" /> {roommates} roommate{roommates !== 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-1.5 truncate"><FaUtensils className="text-gray-400 w-4 h-4" /> {kitchen} kitchen{kitchen !== 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-1.5 truncate col-span-2 sm:col-span-1"><FaRulerCombined className="text-gray-400 w-4 h-4" /> {size}</span>
                    </div>
                </div>
            </Link>

            {/* Buttons and Overlays are positioned on top and use stopPropagation to prevent the link from firing */}
            {!isLandlordView && onWishlistClick && (
                <div className="absolute top-3 right-3 ..." onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlistClick(listingId, isWishlisted); }}>
                    {/* ... Heart Icon ... */}
                </div>
            )}
            {isLandlordView && (
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditListing?.(); }} className="p-2 bg-blue-500 ...">
                        <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteListing?.(); }} className="p-2 bg-red-600 ...">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Landlord stats view */}
            {isLandlordView && (
                <div className="px-4 pb-4">
                    <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-100 pt-3">
                        <span className="flex items-center gap-1"><EyeIcon className="w-4 h-4 text-gray-400" /> Views: <span className="font-semibold">{views || 0}</span></span>
                        <span className="flex items-center gap-1"><SolidCurrencyDollarIcon className="w-4 h-4 text-gray-400" /> Bids: <span className="font-semibold">{bids || 0}</span></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingCard;