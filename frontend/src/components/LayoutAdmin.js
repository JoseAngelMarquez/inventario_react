import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./LayoutAdmin.css"; // Puedes definir estilos aquí

const LayoutAdmin = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin">Inicio</Link></li>
            <li><Link to="/admin/usuarios">Agregar Usuarios</Link></li>
            <li><Link to="/admin/prestamos">Préstamos</Link></li>
            <li><Link to="/admin/materiales">Materiales</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutAdmin;
