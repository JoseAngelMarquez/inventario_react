import React from "react";
import { useNavigate } from "react-router-dom";

function PrestamistaPage() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div>
      <h1>Bienvenido Prestamista</h1>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default PrestamistaPage;
