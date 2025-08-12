import React, { useEffect, useState } from "react";
import { obtenerMateriales } from "../../services/materialService";
import { obtenerTotales } from "../../services/inventarioService";
import "../../styles/Inicio.css";
import { CiSearch } from "react-icons/ci";

const Inicio = () => {
  const [materiales, setMateriales] = useState(null);
  const [totales, setTotales] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resMateriales, resTotales] = await Promise.all([
          obtenerMateriales(),
          obtenerTotales()
        ]);
        setMateriales(resMateriales.data);
        setTotales(resTotales.data);
        setError(null);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  // Filtrar materiales por texto ingresado
  const materialesFiltrados = materiales.filter((mat) =>
    mat.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    mat.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
    mat.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h2>Panel de Materiales</h2>

      <div className="panel-container">
        <div className="panel-box">
          <h3>Materiales Totales</h3>
          <p>{totales?.totalMateriales ?? "N/A"}</p>
        </div>
        <div className="panel-box">
          <h3>Materiales Disponibles</h3>
          <p>{totales?.materialesDisponibles ?? "N/A"}</p>
        </div>
        <div className="panel-box">
          <h3>Materiales Prestados</h3>
          <p>{totales?.materialesPrestados ?? "N/A"}</p>
        </div>
      </div>

      <h3>Lista de Materiales</h3>

      <div className="search-container">
      <CiSearch className="search-icon"/>

        <input className="search-input"
        
          label="Buscar material"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)} 
        />
      </div>

      <table className="table-materiales">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Cantidad Disponible</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {materialesFiltrados.length > 0 ? (
            materialesFiltrados.map((mat) => (
              <tr key={mat.id}>
                <td>{mat.nombre}</td>
                <td>{mat.tipo}</td>
                <td>{mat.cantidad_disponible}</td>
                <td>{mat.descripcion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay materiales que coincidan con la búsqueda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  );
};

export default Inicio;