import { useState, useEffect } from "react"
import { X, Linkedin, Github, Mail } from "lucide-react"

const MemberModal = ({ member, isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleImageError = () => {
    setImageError(true)
  }

  if (!isOpen || !member) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Modal Content */}
        <div className="p-6 md:p-8">
          {/* Profile Section */}
          <div className="text-center mb-6">
            <div
              className={`w-32 h-32 ${member.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden`}
            >
              {imageError ? (
                <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">{member.name.charAt(0)}</span>
                </div>
              ) : (
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-28 h-28 rounded-full object-cover"
                  onError={handleImageError}
                />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h2>
            <p className="text-blue-600 font-medium text-lg mb-4">{member.title}</p>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-600 leading-relaxed">{member.description}</p>
          </div>

          {/* Additional Info */}
          {member.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
              <p className="text-gray-600 leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="flex gap-3 justify-center flex-wrap">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}

              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}

              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberModal
