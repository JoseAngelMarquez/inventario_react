import React from "react";
import styles from "../../styles/Materiales.module.css"; // puedes tener un CSS genérico o propio

const SearchInput = ({ value, onChange, placeholder = "Buscar..." }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={styles.searchInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchInput;
