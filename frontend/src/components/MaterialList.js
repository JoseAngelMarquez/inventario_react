import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


/**
 *Componente para mostrar la lista de materiales y editar o eliminar
 *
 * @param {*} { materiales, onEditar, onEliminar }
 * @return {*} 
 */
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
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {materiales.map((mat) => (
          <tr key={mat.id}>
            <td>{mat.nombre}</td>
            <td>{mat.tipo}</td>
            <td>{mat.cantidad_disponible}</td>
            <td>{mat.descripcion}</td>
            <td>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => onEditar(mat)}>
                  <FaEdit style={{ marginRight: "5px" }} />
                  Editar
                </button>
                <button onClick={() => onEliminar(mat.id)}>
                  <MdDelete style={{ marginRight: "5px" }} />
                  Eliminar
                </button>
              </div>
            </td>

          </tr>
        ))}
      </tbody>
    </table>

  );
};

export default MaterialList;
