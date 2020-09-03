import React from "react";

import "./styles.css";

function Logo({ className }) {
  return (
    <div className={"wrap-logo " + className}>
      <h1 className="title">
        <span className="title-primary">Ecampus</span>Finder
      </h1>
    </div>
  );
}

export default Logo;
