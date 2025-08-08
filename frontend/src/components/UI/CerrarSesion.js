import React from "react";
import { useNavigate } from "react-router-dom";

const CerrarSesion = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <button onClick={cerrarSesion} style={{ marginTop: "1rem" }}>
      Cerrar sesión
    </button>
  );
};

export default CerrarSesion;
