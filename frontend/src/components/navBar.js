import React, { useEffect, useState } from "react";
import { obtenerUsuarios } from "../services/usuarioService";

const NavBar = () => {
  const [userName, setUserName] = useState("Cargando...");

  useEffect(() => {
    obtenerUsuarios()
      .then(data => {
        setUserName(data.nombre || "Usuario");
      })
      .catch(() => {
        setUserName("Usuario");
      });
  }, []);

  return (
    <div style={{ color: "#fff", padding: "10px" }}>
      <h2>Bienvenido, {userName}</h2>
    </div>
  );
};

export default NavBar;
