import React, { useEffect, useState } from "react";
import { obtenerMateriales } from "../../services/materialService";

const Inicio = () => {
  const [materiales, setMateriales] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarMateriales = async () => {
      try {
        const data = await obtenerMateriales();
        setMateriales(data);
      } catch (err) {
        setError("Error cargando materiales");
      }
    };
    cargarMateriales();
  }, []);

  if (error) return <p>{error}</p>;
  if (!materiales) return <p>Cargando materiales...</p>;

  return (
    <div>
      <h2>Panel de Materiales</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Materiales Totales</h3>
          <p>{materiales.totalMateriales}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Materiales Disponibles</h3>
          <p>{materiales.materialesDisponibles}</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Materiales Prestados</h3>
          <p>{materiales.materialesPrestados}</p>
        </div>
      </div>

      {/* Aquí podrías mostrar tabla con datos de préstamos */}
    </div>
  );
};

export default Inicio;
