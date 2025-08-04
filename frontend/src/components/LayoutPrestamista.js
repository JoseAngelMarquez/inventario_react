import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const LayoutPrestamista = () => {
  const navigate = useNavigate();

  const cerrarSesion = () =>{
    localStorage.removeItem("usuario");
    navigate("/");
  };
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Prestamista</h2>
        <nav>
          <ul>
            <li><Link to="/prestamista">Inicio</Link></li>
            <li><Link to="/prestamista/prestamos">Préstamos</Link></li>
            <li><Link to="/prestamista/materiales">Materiales</Link></li>
            <li>
              <button onClick={cerrarSesion} style={{ marginTop: "1rem" }}>
                Cerrar sesión
              </button>
            </li>
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
