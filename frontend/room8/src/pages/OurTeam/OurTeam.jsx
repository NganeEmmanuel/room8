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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Room8</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                Our Services
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                Listings
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                Login
              </a>
              <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
                Signup
              </a>
            </nav>
          </div>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="bg-blue-600 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4">Room8</h3>
              <p className="text-blue-100 mb-4">Ready to find your next connect</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100">
                Get Started
              </button>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <a href="#" className="hover:text-white">
                    Buying
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Selling
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Renting
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <a href="#" className="hover:text-white">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <a href="#" className="hover:text-white">
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
