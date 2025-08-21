import React, { useEffect, useState } from "react";
import logo_uaeh from "../images/logo_uaeh.png"; // Asegúrate de que la ruta sea correcta

const NavBar = () => {
  const [userName, setUserName] = useState("Cargando...");

  useEffect(() => {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioLogueado && usuarioLogueado.usuario) {
      setUserName(usuarioLogueado.usuario);
    } else {
      setUserName("Usuario");
    }
  }, []);

  // Definir estilos antes del return
  const styles = {
    navbar: {
      color: "#fff",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      gap: "50vh", 
    },
    logo: {
      height: "20vh",
      width: "20vh",
    },
  };

  return (
    <div style={styles.navbar}>
      <img src={logo_uaeh} alt="Logo" style={styles.logo} />
      <h2>Bienvenido {userName}</h2>
    </div>
  );
};

export default NavBar;
