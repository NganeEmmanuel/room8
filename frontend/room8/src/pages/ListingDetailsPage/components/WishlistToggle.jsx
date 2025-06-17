import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
import { useNavigate } from "react-router-dom"

const WishlistToggle = ({ listingId, isWishlisted, onToggleWishlist, isAuthenticated }) => {
  const navigate = useNavigate()

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    if (onToggleWishlist) {
      onToggleWishlist(listingId)
    }
  }

  return (
    <button
      onClick={handleToggleWishlist}
      className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlisted ? (
        <HeartSolid className="h-6 w-6 text-blue-400-500" />
      ) : (
        <HeartOutline className="h-6 w-6 text-gray-500" />
      )}
    </button>
  )
}

export default WishlistToggle
