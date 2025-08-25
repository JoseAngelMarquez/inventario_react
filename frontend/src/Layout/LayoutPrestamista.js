import React from "react";
import { Link, Outlet } from "react-router-dom";
import CerrarSesion from "../components/UI/BtnCerrar";
import styles from "../styles/LayoutPrestamos.module.css";
import NavBar from "../components/navBar";
const LayoutPrestamista = () => {

  return (
    
    <div className={styles.parent}>
      <header className={styles.div1}>

        <NavBar />
      </header>

        <aside className={styles.div2}>

        <h2>Prestamista</h2>
        <nav>
          <ul>
            <li><Link to="/prestamista">Inicio</Link></li>
            <li><Link to="/prestamista/prestamos">Préstamos</Link></li>
            <li><Link to="/prestamista/materiales">Materiales</Link></li>
            <li><Link to="/prestamista/Excel">Exportar Excel</Link></li>
            <li><CerrarSesion /></li>
          </ul>
          </nav>
        </aside>
      <main className={styles.div3}>
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutPrestamista;
