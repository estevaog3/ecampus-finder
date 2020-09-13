import React from "react";
import PropTypes from "prop-types";

import "./styles.css";

function Logo({ className, onClick }) {
  return (
    <h1 className={"title " + className} onClick={onClick}>
      <span className="title-primary">Ecampus</span>Finder
    </h1>
  );
}

Logo.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Logo;
