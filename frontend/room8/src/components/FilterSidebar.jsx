// src/components/FilterSidebar.jsx
import React from "react"
import { XMarkIcon } from "@heroicons/react/24/solid"

const FilterSidebar = ({
  roomTypes,
  selectedTypes,
  onToggleRoomType,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  sort,
  setSort,
  onApply,
    onClear,
  onClose,
}) => {
  return (
    <div className="h-full flex flex-col p-4 space-y-4 overflow-y-auto">
  {/* Close Button */}
  <button
    onClick={onClose}
    className="absolute top-2 right-2 p-2 rounded hover:bg-gray-200 transition"
    aria-label="Close Filters"
  >
    <XMarkIcon className="h-5 w-5 text-gray-600" />
  </button>

  <h2 className="text-lg font-semibold">Filters</h2>

  {/* Price range */}
  <div>
    <h3 className="font-medium text-sm mb-1">Price Range (FCFA)</h3>
    <div className="flex gap-2">
      <input
        type="number"
        min="0"
        placeholder="Min"
        value={priceMin}
        onChange={(e) => setPriceMin(e.target.value)}
        className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-blue-600"
      />
      <input
        type="number"
        min="0"
        placeholder="Max"
        value={priceMax}
        onChange={(e) => setPriceMax(e.target.value)}
        className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-blue-600"
      />
    </div>
  </div>

  {/* Sort by */}
  <div>
    <h3 className="font-medium text-sm mb-1">Sort by</h3>
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-blue-600"
    >
      <option value="">Default</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="date-newest">Date: Newest First</option>
      <option value="date-oldest">Date: Oldest First</option>
    </select>
  </div>

  {/* Room Type Filters */}
  <div>
    <h3 className="font-medium text-sm mb-1">Room Type</h3>
    {roomTypes.map((type) => (
      <label key={type} className="flex items-center gap-2 text-sm mb-1">
        <input
          type="checkbox"
          checked={selectedTypes.includes(type)}
          onChange={() => onToggleRoomType(type)}
          className="accent-blue-600"
        />
        {type}
      </label>
    ))}
  </div>

       {/* Clear Filters Button */}
      <button
        onClick={onClear}
        className="w-full px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded hover:bg-blue-600 transition mb-4"
      >
        Clear Filters
      </button>

 <button
  onClick={onApply}
  className="w-full px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded hover:bg-blue-600 transition mb-4"
>
  Apply Filters
</button>

</div>

  )
}

export default FilterSidebar
