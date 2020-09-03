import React from "react";

function SearchBar({ placeholder }) {
  return (
    <form>
      <input type="search" placeholder={placeholder} />
    </form>
  );
}

export default SearchBar;
