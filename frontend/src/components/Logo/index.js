import React from "react";
import PropTypes from "prop-types";

import "./styles.css";

function Logo({ className }) {
  return (
    <h1 className={"title " + className}>
      <span className="title-primary">Ecampus</span>Finder
    </h1>
  );
}

Logo.propTypes = {
  className: PropTypes.string,
};

export default Logo;
