import React from "react";

import "./styles.css";

function Logo({ slogan }) {
  return (
    <div className="wrap-logo">
      <h1 className="title">
        <span className="title-primary">Ecampus</span>Finder
      </h1>
      <h2 className="slogan">{slogan}</h2>
    </div>
  );
}

export default Logo;
