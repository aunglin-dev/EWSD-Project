import React from "react";

export default function FormErrorMessage(props) {
  return (
    <div>
      <span style={{ color: "red", fontSize: "small" }}>*{props.error}</span>
    </div>
  );
}
