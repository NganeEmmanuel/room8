import { useState } from "react"

const MemberCard = ({ member, onCardClick }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <div
      className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={() => onCardClick(member)}
    >
      <div className="text-center">
        <div
          className={`w-20 h-20 md:w-24 md:h-24 ${member.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden`}
        >
          {imageError ? (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">{member.name.charAt(0)}</span>
            </div>
          ) : (
            <>
              {imageLoading && <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 animate-pulse"></div>}
              <img
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ${imageLoading ? "hidden" : "block"}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </>
          )}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-blue-600 font-medium mb-3 md:mb-4 text-sm md:text-base">{member.title}</p>
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-3">{member.description}</p>

        {/* Click indicator */}
        <div className="mt-4 text-blue-600 text-sm font-medium opacity-70">Click to learn more →</div>
      </div>
    </div>
  )
}

export default MemberCard
