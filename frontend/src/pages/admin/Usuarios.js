import React, { useState } from "react";
import { crearUsuario } from "../../services/usuarioService";

const Inicio = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("prestamista");
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

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

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
};

export default Inicio;
