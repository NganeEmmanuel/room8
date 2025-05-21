
const BidsSection = ({ bids, onAccept, onReject }) => {
  if (!bids || bids.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-500">No bids available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <img
              src={bid.user.avatar || "/placeholder.svg"}
              alt={bid.user.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-medium">{bid.user.name}</span>
          </div>

          <p className="text-lg font-bold text-gray-800 mb-3">
            {bid.amount.toLocaleString()} {bid.currency}
          </p>

          <div className="flex space-x-2">
            <button
              onClick={() => onAccept(bid.id)}
              className="flex-1 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => onReject(bid.id)}
              className="flex-1 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BidsSection
