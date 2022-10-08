import React from "react";
import PropTypes from "prop-types";

import "./styles.css";

function Button({ text, onClick, disabled, isSmall, children }) {
  return (
    <button
      className={
        "button " +
        (disabled ? "button--disabled" : "") +
        " " +
        (isSmall ? "button--small" : "")
      }
      onClick={(e) => {
        if (!disabled) {
          onClick(e);
        }
      }}
    >
      {children ? children : text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  isSmall: PropTypes.bool,
};

export default Button;
