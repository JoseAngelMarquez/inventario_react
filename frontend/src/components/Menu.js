// src/components/Menu.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/admin" style={{ marginRight: "10px" }}>Materiales</Link>
      <Link to="/prestamista" style={{ marginRight: "10px" }}>Prestamista</Link>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </nav>
  );
};

export default Menu;
