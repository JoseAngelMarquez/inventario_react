import React, { useEffect, useState } from "react";

const NavBar = () => {
  const [userName, setUserName] = useState("Cargando...");

  useEffect(() => {
    // Leer usuario logueado desde localStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));
    
    if (usuarioLogueado && usuarioLogueado.usuario) {
      setUserName(usuarioLogueado.usuario);
    } else {
      setUserName("Usuario");
    }
  }, []);

  return (
    <div style={{ color: "#fff", padding: "10px" }}>
      <h2>Bienvenido, {userName}</h2>
    </div>
  );
};

export default NavBar;
