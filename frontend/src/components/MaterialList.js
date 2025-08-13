import React from "react";

const MaterialList = ({ materiales, onEditar, onEliminar }) => {
  if (materiales.length === 0) {
    return <p>No hay materiales registrados.</p>;
  }

  return (
    
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Cantidad Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((mat) => (
            <tr key={mat.id}>
              <td>{mat.nombre}</td>
              <td>{mat.tipo}</td>
              <td>{mat.cantidad_disponible}</td>
              <td>
                <button onClick={() => onEditar(mat)}>Editar</button>
                <button onClick={() => onEliminar(mat.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        
  );
};

export default MaterialList;
