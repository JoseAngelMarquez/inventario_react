// UsuarioTable.jsx
import React from "react";

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
              <button onClick={() => onEditar(user)}>Editar</button>
              <button onClick={() => onEliminar(user.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsuarioList;
