import React, { useEffect, useState } from "react";
import { obtenerMateriales, filtrarMaterialPorNombre } from "../../services/materialService";
import { obtenerTotales } from "../../services/inventarioService";
import styles from "../../styles/Inicio.module.css";
import SearchInput from "../../components/UI/InputBusqueda";

const Inicio = () => {
  const [materiales, setMateriales] = useState([]);
  const [totales, setTotales] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Cargar materiales y totales al inicio
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
        //console.error("Error cargando datos:", err);
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // Filtrar materiales según busqueda
  useEffect(() => {
    const fetchBusqueda = async () => {
      try {
        if (busqueda.trim() === "") {
          const res = await obtenerMateriales();
          setMateriales(res.data);
        } else {
          const res = await filtrarMaterialPorNombre(busqueda);
          setMateriales(res.data);
        }
      } catch (err) {
        //console.error("Error en búsqueda:", err);
        setError("Error en la búsqueda");
      }
    };

    fetchBusqueda();
  }, [busqueda]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Panel de Materiales</h2>

      <div className={styles["boton-cerrar"]}>
        <div className={styles["panel-box"]}>
          <h3>Materiales Totales</h3>
          <p>{totales?.totalMateriales ?? "N/A"}</p>
        </div>
        <div className={styles["panel-box"]}>
          <h3>Tipos de Materiales Disponibles</h3>
          <p>{totales?.materialesDisponibles ?? "N/A"}</p>
        </div>
        <div className={styles["panel-box"]}>
          <h3>Materiales Prestados</h3>
          <p>{totales?.materialesPrestados ?? "N/A"}</p>
        </div>
      </div>

      <h3>Lista de Materiales</h3>

      <div className={styles["search-container"]}>
        <SearchInput
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar material..."
      />
      </div>

      <table className={styles["table-materiales"]}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Cantidad Disponible</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {materiales.length > 0 ? (
            materiales.map((mat) => (
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
