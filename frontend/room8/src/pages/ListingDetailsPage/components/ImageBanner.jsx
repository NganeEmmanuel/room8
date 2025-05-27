import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

const ImageBanner = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const fallbackImage = "https://via.placeholder.com/800x400?text=No+Image+Available"

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={fallbackImage}
          alt="Property"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
      <img
        src={images[currentImageIndex] || fallbackImage}
        alt={`Property view ${currentImageIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow-md hover:bg-opacity-100 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow-md hover:bg-opacity-100 transition-all"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-800" />
          </button>
        </>
      )}
    </div>
  )
}

export default ImageBanner
