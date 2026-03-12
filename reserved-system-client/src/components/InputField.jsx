import React from "react";

const InputField = (props) => {
  // Supported types for element input 
  const INPUTS = ["text", "number", "date", "password", "email", "datetime-local"];

  // Validation element and type
  const type = props.type.toLowerCase();
  const isTextarea = type === "textarea";
  const required = props.required || false;
  const isDisabled = props.disabled;  
  const error = props.error;
  

  if (!isTextarea && !INPUTS.includes(type)) {
    return null;
  }

  // The assignment of a minimum value to the attribute of the corresponding type
  const minProp = props.min || null;
  const min = ["number", "date"].includes(type) ? minProp : null;
  const minlength = ["text", "textarea", "password"].includes(type) ? minProp : null;
  

  return (
    <div className="form-group mb-3">

      <label>{props.label}:</label>

      {/* Rendering the current element" */}
      {isTextarea ? (
        <textarea
          required={required}
          className="form-control"
          placeholder={props.prompt}
          rows={props.rows}
          minLength={minlength}
          name={props.name}
          value={props.value}
          onChange={props.handleChange}
          onFocus={props.onFocus}  
          onBlur={props.onBlur}     
          disabled={isDisabled}
          autoComplete={props.autoComplete}
        />
      ) : (
        <input
          required={required}
          type={type}
          className="form-control"
          placeholder={props.prompt}
          minLength={minlength}
          min={min}
          name={props.name}
          value={props.value}
          onChange={props.handleChange}
          onFocus={props.onFocus}   
          onBlur={props.onBlur}    
          disabled={isDisabled}
          autoComplete={props.autoComplete}
          
        />
      )}
      
      {/* Displaying the error message */}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    
    </div>
  );
}

export default InputField;
