// src/components/FilterSidebar.jsx

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const FilterSidebar = ({
  allRoomTypes = [],
  filters,
  onFilterChange,
  onApply,
  onClear,
  onClose,
}) => {

  // This helper function makes the labels look nice in the UI
  // e.g., "SingleRoom" becomes "Single Room"
  const formatTypeForDisplay = (type) => {
    if (!type) return '';
    return type.replace(/([A-Z])/g, ' $1').trim();
  };

  // Handler to toggle room types in the parent's state
  const handleToggleRoomType = (type) => {
    const currentTypes = filters.selectedRoomTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    onFilterChange('selectedRoomTypes', newTypes);
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-6 overflow-y-auto bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition"
            aria-label="Close Filters"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-medium text-sm mb-2 text-gray-700">Price Range (FCFA)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-1/2 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-1/2 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sort by */}
      <div>
        <h3 className="font-medium text-sm mb-1 text-gray-700">Sort by</h3>
        <select
          value={filters.sort || ''}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="date-newest">Date: Newest First</option>
        </select>
      </div>

      {/* Room Type Filters */}
      <div>
        <h3 className="font-medium text-sm mb-1 text-gray-700">Room Type</h3>
        <div className="space-y-2">
          {allRoomTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm cursor-pointer font-normal text-gray-800">
              <input
                type="checkbox"
                checked={(filters.selectedRoomTypes || []).includes(type)}
                onChange={() => handleToggleRoomType(type)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {formatTypeForDisplay(type)}
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-grow flex flex-col justify-end space-y-3 pt-4 border-t border-gray-200 mt-4">
        <button
          onClick={onApply}
          className="w-full px-4 py-2 text-md font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-sm"
        >
          Apply Filters
        </button>
        <button
          onClick={onClear}
          className="w-full px-4 py-2 text-md font-semibold bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;