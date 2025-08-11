import React, { useEffect, useState } from "react";
import { obtenerUsuarioActual } from "../services/usuarioService";

const NavBar = () => {
  const [userName, setUserName] = useState("Cargando...");

  useEffect(() => {
    obtenerUsuarioActual()
      .then(data => {
        setUserName(data.nombre || "Usuario");
      })
      .catch(() => {
        setUserName("Usuario");
      });
  }, []);

  return (
    <div style={{ backgroundColor: "#333", color: "#fff", padding: "10px" }}>
      <h2>Bienvenido, {userName}</h2>
    </div>
  );
};

export default NavBar;
