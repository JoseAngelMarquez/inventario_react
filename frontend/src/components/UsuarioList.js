// UsuarioTable.jsx
import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


/**
 *Componente para mostrar lista de usuarios asi como función de eliminar o editar 
 *
 * @param {*} { usuarios, onEditar, onEliminar }
 * @return {*} 
 */

const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));
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

              {usuarioLogueado?.usuario === user.usuario ? (
                <span style={{ fontWeight: "bold", color: "green" }}>
                  <p>Usuario logueado</p>
                </span>
              ) : (
                <>
                  <button onClick={() => onEditar(user)} >
                    <FaEdit style={{ marginRight: "5px" }} />
                    Editar
                  </button>

                  <button onClick={() => onEliminar(user.id)} style={{ marginLeft: "10px" }}>
                    <MdDelete style={{ marginRight: "5px" }} />
                    Eliminar
                  </button>

                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsuarioList;
