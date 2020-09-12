import React from "react";
import PropTypes from "prop-types";

import "./styles.css";

function Button({ text, onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children ? children : text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Button;
