import React from "react";

const UsuarioList = ({ usuarios, onEditar, onEliminar }) => {
  if (usuarios.length === 0) {
    return <p>No hay usuarios registrados.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Contraseña</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((user) => (
          <tr key={user.id}>
            <td>{user.usuario}</td>
            <td>{user.rol}</td>
            <td>••••••••</td> {/* Para no mostrar la contraseña real */}
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
