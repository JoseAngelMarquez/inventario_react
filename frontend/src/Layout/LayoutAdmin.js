import React from "react";
import { Link, Outlet } from "react-router-dom";
import CerrarSesion from "../components/UI/BtnCerrar";
import styles from "../styles/LayoutAdmin.module.css"; 
import NavBar from "../components/navBar"; 

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
            <li><Link to="/admin">Inicio</Link></li>
            <li><Link to="/admin/usuarios">Agregar Usuarios</Link></li>
            <li><Link to="/admin/prestamos">Préstamos</Link></li>
            <li><Link to="/admin/materiales">Materiales</Link></li>
            <li><Link to="/admin/Excel">Exportar Excel</Link></li>
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
