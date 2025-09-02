import React from "react";
import "../../styles/Prestamos.css";

/**
 *Componente para filtrar por nombre del solicitante,
 *nombre de material o por fecha de préstamo
 * @param {*} { filtros, onChange }
 * @return {*} 
 */
function FiltroPrestamos({ filtros, onChange }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        name="solicitante"
        value={filtros.solicitante}
        onChange={onChange}
        placeholder="Buscar por nombre"
        style={{ marginRight: "8px" }}
      />

      <input
        type="text"
        name="material"
        value={filtros.material}
        onChange={onChange}
        placeholder="Buscar por material"
        style={{ marginRight: "8px" }}
      />

      <input
        type="date"
        name="fecha"
        value={filtros.fecha}
        onChange={onChange}
      />
    </div>
  );
}

export default FiltroPrestamos;
