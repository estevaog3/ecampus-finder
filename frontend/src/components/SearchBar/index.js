import React from "react";

import "./styles.css";

function SearchBar({ placeholder, className }) {
  return (
    <form className={className}>
      <input
        className="search-bar-input"
        type="text"
        placeholder={placeholder}
      />
    </form>
  );
}

export default SearchBar;
