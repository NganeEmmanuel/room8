export default function TeamPage() {
  const teamMembers = [
    {
      name: "Ngane Emmanuel",
      title: "Scrum Master",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-orange-400",
    },
    {
      name: "Tekoh Bildad",
      title: "Product Owner",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-blue-400",
    },
    {
      name: "Brian",
      title: "CTO",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-gray-300",
    },
    {
      name: "Chi Rosita",
      title: "CFO",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      image: "/placeholder.svg?height=120&width=120",
      bgColor: "bg-gray-300",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Team</h1>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="text-center">
                <div
                  className={`w-24 h-24 ${member.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden`}
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
