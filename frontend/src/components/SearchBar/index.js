import React from "react";
import { useState } from "react";
import "./styles.css";
import { ReactComponent as SearchIcon } from "./search.svg";
import { ReactComponent as CloseIcon } from "./close.svg";

function SearchBar({ placeholder }) {
  const [query, setQuery] = useState("");

  const onQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const onCloseIconClick = () => {
    setQuery("");
  };

  const onSearchIconClick = () => {
    //TODO: consultar API de turmas
    console.log("query:", query);
  };

  const toggleCloseIconClass = () => {
    if (query.length == 0) {
      return "";
    }
    return "search-control-close--appear-yes";
  };

  return (
    <form className="search-bar-wrap">
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
        <SearchIcon
          onClick={onSearchIconClick}
          className="search-control-search"
        />
      </div>
    </form>
  );
}

export default SearchBar;
