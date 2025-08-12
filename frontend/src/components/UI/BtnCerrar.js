import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/BotonCerrar.css";
const CerrarSesion = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <button onClick={cerrarSesion} className="boton">
      Cerrar sesión
    </button>
  );
};

export default CerrarSesion;
