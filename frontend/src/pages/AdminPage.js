// src/pages/AdminPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div>
      <h1>Bienvenido Administrador</h1>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default AdminPage;
