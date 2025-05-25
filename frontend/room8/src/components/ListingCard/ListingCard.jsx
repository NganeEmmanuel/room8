import { FaBed, FaBath, FaUsers, FaUtensils, FaRulerCombined } from 'react-icons/fa';
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import  {Link} from 'react-router-dom'
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
    <Link to={`/listingDetails?listingId=${listingId}`}>
     <div className="block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-[1.02] bg-white w-full">
  {/* Image */}
  <div className="relative">
    <img
      src={image}
      alt={title}
      className="w-full h-44 sm:h-48 object-cover"
    />
    <div
      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onWishlistClick?.(listingId, isWishlisted);
      }}
    >
      {isWishlisted ? (
        <AiFillHeart className="text-blue-500 text-lg" />
      ) : (
        <AiOutlineHeart className="text-blue-500 text-lg" />
      )}
    </div>
  </div>

  {/* Content */}
  <div className="p-4 space-y-1">
    <div className="flex justify-between items-start">
      <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate max-w-[70%]">
        {title}
      </h3>
      <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded whitespace-nowrap">
        {roomType}
      </span>
    </div>

    <p className="text-xs text-gray-500 truncate">📍 {location}</p>
    <p className="text-blue-600 font-bold text-sm">{price}</p>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[11px] sm:text-xs text-gray-500">
      <span className="flex items-center gap-1 truncate">
        <FaBed /> {rooms} rooms
      </span>
      <span className="flex items-center gap-1 truncate">
        <FaBath /> {toilets} toilets
      </span>
      <span className="flex items-center gap-1 truncate">
        <FaUsers /> {roommates} roommates
      </span>
      <span className="flex items-center gap-1 truncate">
        <FaUtensils /> {kitchen} kitchen
      </span>
      <span className="flex items-center gap-1 truncate col-span-2 sm:col-span-1">
        <FaRulerCombined /> {size}
      </span>
    </div>
  </div>
</div>

    </Link>
  );
}

export default ListingCard;
