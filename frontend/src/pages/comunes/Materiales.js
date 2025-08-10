import React, { useEffect, useState } from "react";
import { obtenerMateriales } from "../../services/materialService";

const Inicio = () => {
  const [materiales, setMateriales] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarMateriales = async () => {
      try {
        const res = await obtenerMateriales(); // ← devuelve objeto axios
        console.log("Materiales recibidos:", res.data); // debug
        setMateriales(res.data); // ← aquí usamos solo el array
      } catch (err) {
        console.error(err);
        setError("Error cargando materiales");
      } finally {
        setCargando(false);
      }
    };
    cargarMateriales();
  }, []);

  if (cargando) return <p>Cargando materiales...</p>;
  if (error) return <p>{error}</p>;

  // Calcular totales
  const totalMateriales = materiales.length;
  const materialesDisponibles = materiales.filter(m => m.cantidad_disponible > 0).length;
  const materialesPrestados = totalMateriales - materialesDisponibles;

  return (
    <div>
      <h2>Panel de Materiales</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Materiales Totales</h3>
          <p>{totalMateriales}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Materiales Disponibles</h3>
          <p>{materialesDisponibles}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Materiales Prestados</h3>
          <p>{materialesPrestados}</p>
        </div>
      </div>

      {/* Lista de materiales */}
      <h3 style={{ marginTop: "2rem" }}>Lista de Materiales</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad Disponible</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.cantidad_disponible}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inicio;
