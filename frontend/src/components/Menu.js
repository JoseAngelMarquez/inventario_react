// src/components/Menu.js
import React from "react";
import { Link } from "react-router-dom";
import CerrarSesion from "./CerrarSesion"; 

const Menu = () => {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/admin" style={{ marginRight: "10px" }}>Materiales</Link>
      <Link to="/prestamista" style={{ marginRight: "10px" }}>Prestamista</Link>
      <CerrarSesion />  
    </nav>
  );
};

export default Menu;
