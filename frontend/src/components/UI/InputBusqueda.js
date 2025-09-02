import React from "react";
import styles from "../../styles/Materiales.module.css"; 


/**
 *Componente para Busqueda (Usada solamente en inicio)
 *
 * @param {*} { value, onChange, placeholder = "Buscar..." }
 * @return {*} 
 */
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
