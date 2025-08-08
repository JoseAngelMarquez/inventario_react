import React from "react";

function InputText({ label, type = "text", value, onChange, required = false }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.3rem" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "1rem",
        }}
      />
    </div>
  );
}

export default InputText;
