// src/components/FilterBar.jsx
import React from 'react';

const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      location: '',
      type: '',
      condition: '',
      priceMin: '',
      priceMax: '',
      reraNumber: '',
    });
  };

  return (
    <div className="filter-bar flex flex-wrap gap-3 items-center justify-center py-4 px-3  rounded-lg shadow-lg">
      <input
        className="px-4 py-2 border border-gray-300 rounded w-[150px] bg-white text-gray-700"
        type="text"
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleChange}
      />

      <select
        name="type"
        value={filters.type}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded w-[140px] bg-white text-gray-700"
      >
        <option value="">All Types</option>
        <option value="Flat">Flat</option>
        <option value="Plot">Plot</option>
      </select>

      <select
        name="condition"
        value={filters.condition}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded w-[150px] bg-white text-gray-700"
      >
        <option value="">All Conditions</option>
        <option value="New">New</option>
        <option value="Old">Old</option>
      </select>

      <input
        type="number"
        name="priceMin"
        placeholder="Min Price"
        value={filters.priceMin}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded w-[120px] bg-white text-gray-700"
      />

      <input
        type="number"
        name="priceMax"
        placeholder="Max Price"
        value={filters.priceMax}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded w-[120px] bg-white text-gray-700"
      />

      <input
        type="text"
        name="reraNumber"
        placeholder="RERA No."
        value={filters.reraNumber || ''}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded w-[160px] bg-white text-gray-700"
      />

      <button
        onClick={handleReset}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
      >
        Reset
      </button>
    </div>
  );
};

export default FilterBar;
