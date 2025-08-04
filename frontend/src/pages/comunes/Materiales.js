// src/pages/Materiales.js
import React, { useEffect, useState } from "react";
import {
  obtenerMateriales,
  agregarMaterial,
  actualizarMaterial,
  eliminarMaterial,
} from "../../services/materialService";
import MaterialForm from "../../components/MaterialForm";

const Materiales = () => {
  const [materiales, setMateriales] = useState([]);
  const [editando, setEditando] = useState(null);

  const cargarMateriales = async () => {
    const res = await obtenerMateriales();
    setMateriales(res.data);
  };

  useEffect(() => {
    cargarMateriales();
  }, []);

  const handleAddOrUpdate = async (material) => {
    if (editando) {
      await actualizarMaterial(editando.id, material);
      setEditando(null);
    } else {
      await agregarMaterial(material);
    }
    cargarMateriales();
  };

  const handleDelete = async (id) => {
    await eliminarMaterial(id);
    cargarMateriales();
  };

  return (
    <div>
      <h2>Gestión de Materiales</h2>
      <MaterialForm onSubmit={handleAddOrUpdate} materialEditado={editando} cancelar={() => setEditando(null)} />
      <ul>
        {materiales.map((mat) => (
          <li key={mat.id}>
            {mat.nombre} - {mat.tipo} - Cantidad: {mat.cantidad_disponible}
            <button onClick={() => setEditando(mat)}>Editar</button>
            <button onClick={() => handleDelete(mat.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Materiales;
