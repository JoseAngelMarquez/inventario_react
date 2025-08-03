// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputText from "../components/InputText";
import { loginUsuario } from "../services/usuarioService";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const datos = await loginUsuario({ usuario, contrasena });
      const { usuario: user } = datos;

      alert(`Bienvenido ${user.usuario} (${user.rol})`);

      localStorage.setItem("usuario", JSON.stringify(user));

      if (user.rol === "admin") {
        navigate("/admin");
      } else if (user.rol === "prestamista") {
        navigate("/prestamista");
      } else {
        setError("Rol no reconocido");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <InputText
          label="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <InputText
          label="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
