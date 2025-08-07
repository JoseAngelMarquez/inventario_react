import React from "react";

const MaterialList = ({ materiales, onEditar, onEliminar }) => {
  if (materiales.length === 0) {
    return <p>No hay materiales registrados.</p>;
  }

  return (
    <ul>
      {materiales.map((mat) => (
        <li key={mat.id}>
          <strong>{mat.nombre}</strong> - {mat.tipo} - Cantidad: {mat.cantidad_disponible}
          <button onClick={() => onEditar(mat)}>Editar</button>
          <button onClick={() => onEliminar(mat.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
};

export default MaterialList;
