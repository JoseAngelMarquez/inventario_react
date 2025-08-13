import React, { useEffect, useState } from "react";
import { crearUsuario, obtenerUsuarios } from "../../services/usuarioService";
const Inicio = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("prestamista");
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  
  useEffect(() => {
    const fetchUsuarios = async () => {
    try {
      const lista = await obtenerUsuarios();
      setUsuarios(lista);
      console.log("Usuarios obtenidos:", lista);   
    } catch (error) {
      setError("Error al obtener usuarios");
    }

    };
    fetchUsuarios();
  },[]);
  const handleCrearUsuario = async () => {
    setError(null);
    setMensaje(null);

    if (!usuario || !contrasena) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }

    try {
      const data = await crearUsuario(usuario, contrasena, rol);
      setMensaje(`Usuario creado con ID: ${data.id}`);
      setUsuario("");
      setContrasena("");
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error creando usuario");
    }
  };

  

  return (
    <div>
      <h2>Crear usuario</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="prestamista">Prestamista</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleCrearUsuario}>Crear Usuario</button>
      <table>
        <thead>
          
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.usuario}</td>
              <td>{user.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
};

export default Inicio;
