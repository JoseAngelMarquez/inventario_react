// UsuarioTable.jsx
import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const UsuarioList = ({ usuarios, onEditar, onEliminar }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((user) => (
          <tr key={user.id}>
            <td>{user.usuario}</td>
            <td>{user.rol}</td>
            <td>
              <button onClick={() => onEditar(user)} >
              <FaEdit style={{ marginRight: "5px" }} />
                Editar
              </button>

              <button onClick={() => onEliminar(user.id)} style={{ marginLeft: "10px" }}>
              <MdDelete style={{ marginRight: "5px" }} />
              Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsuarioList;
