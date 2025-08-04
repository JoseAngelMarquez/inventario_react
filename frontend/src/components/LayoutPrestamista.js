// src/components/LayoutPrestamista.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const LayoutPrestamista = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Prestamista</h2>
        <nav>
          <ul>
            <li><Link to="/prestamista/inicio">Inicio</Link></li>
            <li><Link to="/prestamista/prestamos">Mis Préstamos</Link></li>
            {/* Agrega más enlaces si hay más páginas */}
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutPrestamista;
