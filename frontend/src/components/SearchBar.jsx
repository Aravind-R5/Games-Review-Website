// -----------------------------------------------
// SearchBar Component
// -----------------------------------------------
// Reusable search input with icon.
// Used on browse pages for searching movies/games.
// -----------------------------------------------

import { FiSearch } from 'react-icons/fi';

function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-wrapper mb-3">
      <FiSearch className="search-icon" />
      <input
        type="text"
        className="form-control search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', paddingLeft: '2.5rem' }}
        id="page-search"
      />
    </div>
  );
}

export default SearchBar;
