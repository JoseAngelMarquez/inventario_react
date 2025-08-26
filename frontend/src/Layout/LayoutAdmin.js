import React from "react";
import { Link, Outlet } from "react-router-dom";
import CerrarSesion from "../components/UI/BtnCerrar";
import styles from "../styles/LayoutAdmin.module.css"; 
import NavBar from "../components/navBar";
import "../styles/iconos.css";
import { FaUsers } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaHandsHelping } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { BiSolidFileExport } from "react-icons/bi";

const LayoutAdmin = () => {
  return (
    <div className={styles.parent}>
      <header className={styles.div1}>
    <NavBar />
      </header>
      <aside className={styles.div2}>
        <h2>Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin" className="navLink">
            <FaHome className="icono" /> Inicio
            </Link>
            </li>
            <li><Link to="/admin/usuarios" className="navLink">
            <FaUsers className="icono" /> Usuarios
            </Link>
            </li>
            <li><Link to="/admin/prestamos" className="navLink">
            <FaHandsHelping className="icono" /> Préstamos
            </Link>
            </li>
            <li><Link to="/admin/materiales" className="navLink">
            <FaTools className="icono" /> Materiales
            </Link>
            </li>
            <li><Link to="/admin/Excel" className="navLink">
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

export default LayoutAdmin;
