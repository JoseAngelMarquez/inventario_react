import React from "react";
import { Link, Outlet } from "react-router-dom";
import CerrarSesion from "../components/UI/BtnCerrar";
import styles from "../styles/LayoutPrestamos.module.css";
import NavBar from "../components/UI/navBar";
import { FaHome } from "react-icons/fa";
import { FaHandsHelping } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { BiSolidFileExport } from "react-icons/bi";
import "../styles/iconos.css";
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
            <li>
              <Link to="/prestamista" className="navLink">
                <FaHome className="icono" /> Inicio
              </Link>
            </li>

            <li><Link to="/prestamista/prestamos" className="navLink" >
              <FaHandsHelping className="icono" /> Préstamos
            </Link>
            </li>

            <li><Link to="/prestamista/materiales" className="navLink" >
              <FaTools className="icono" /> Materiales
            </Link>
            </li>
            <li>
              <Link to="/prestamista/Excel" className="navLink" >
                <BiSolidFileExport className="icono" /> Exportar Excel
              </Link>
            </li>
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
