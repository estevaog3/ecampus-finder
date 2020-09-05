import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import "./styles.css";
import { ReactComponent as SearchIcon } from "./search.svg";
import { ReactComponent as CloseIcon } from "./close.svg";

function SearchBar({ history, placeholder }) {
  const [query, setQuery] = useState("");

  const onQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const onCloseIconClick = () => {
    setQuery("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    history.push(`/search/${query}`);
  };

  const toggleCloseIconClass = () => {
    if (query.length === 0) {
      return "";
    }
    return "search-control-close--appear-yes";
  };

  return (
    <form className="search-bar-wrap" onSubmit={onSubmit}>
      <input
        className="search-bar-input"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e)}
      />
      <div className="search-controls">
        <CloseIcon
          onClick={onCloseIconClick}
          className={"search-control-close " + toggleCloseIconClass()}
        />
        <button type="submit" className="search-control-search-wrap">
          <SearchIcon className="search-control-search" />
        </button>
      </div>
    </form>
  );
}

SearchBar.propTypes = {
  history: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
