import React, { useState } from 'react';

const SearchInput = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        className="form-control mb-3 mt-2 w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 hover:ring-orange-300" // Tailwind CSS styles
        placeholder="Назва пісні, виконавець..."
      />
      {query && (
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-orange-500 hover:text-orange-700 focus:outline-none"
          onClick={clearSearch}
        >
          <i className="ri-close-fill text-2xl" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
