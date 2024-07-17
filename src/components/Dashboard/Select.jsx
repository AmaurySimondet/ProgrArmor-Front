import React from "react";

function Select(props) {
  return (
        <option value={props.value} className={props.class}> {props.name} </option>
  );
}

export default Select;
