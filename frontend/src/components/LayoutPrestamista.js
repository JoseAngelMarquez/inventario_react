import React from "react";
import { Link, Outlet } from "react-router-dom";

const LayoutPrestamista = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Prestamista</h2>
        <nav>
          <ul>
            <li><Link to="/prestamista">Inicio</Link></li>
            <li><Link to="/prestamista/prestamos">Préstamos</Link></li>
            <li><Link to="/prestamista/materiales">Materiales</Link></li>
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
