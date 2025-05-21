import { HomeIcon, UserGroupIcon, BeakerIcon } from "@heroicons/react/24/outline"

const PropertyDetails = ({ listing }) => {
  const { title, price, currency, location, rooms, toilet, kitchen, roommates, squareFt } = listing

  return (
    <div className="mt-4">
      {/* Title and Location */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex space-x-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
              FIRST FLOOR
            </span>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
              AVAILABLE
            </span>
          </div>
        </div>
        <p className="text-gray-600 flex items-center mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>
      </div>

      {/* Property Features */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div className="flex items-center">
          <div className="mr-2">
            <HomeIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Rooms</p>
            <p className="font-semibold">{rooms}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Toilet</p>
            <p className="font-semibold">{toilet}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-2">
            <BeakerIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Kitchen</p>
            <p className="font-semibold">{kitchen}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-2">
            <UserGroupIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Roommates</p>
            <p className="font-semibold">{roommates}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">square ft</p>
            <p className="font-semibold">{squareFt}</p>
          </div>
        </div>
      </div>

      {/* Price and Action Buttons */}
      <div className="flex flex-wrap items-center justify-between mt-4 pb-4 border-b border-gray-200">
        <div className="mb-2 sm:mb-0">
          <p className="text-blue-500 font-bold text-lg">
            {price.toLocaleString()} {currency} /per month
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Message
          </button>
          <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
            Email
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
