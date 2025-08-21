import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/BotonCerrar.module.css";
const CerrarSesion = () => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <button className={styles.boton} onClick={cerrarSesion}>
      Cerrar sesión
    </button>
  );
};

export default CerrarSesion;
