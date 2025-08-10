import React, { useEffect, useState } from "react";
import MaterialForm from "../../components/materialForm";
import MaterialList from "../../components/MaterialList";
import {
  obtenerMateriales,
  agregarMaterial,
  actualizarMaterial,
  eliminarMaterial,
} from "../../services/materialService";


const Materiales = () => {
  const [materiales, setMateriales] = useState([]);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarMateriales = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await obtenerMateriales();
      setMateriales(res.data);
    } catch (e) {
      setError("Error cargando materiales");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMateriales();
  }, []);

  const handleAddOrUpdate = async (material) => {
    try {
      if (editando) {
        await actualizarMaterial(editando.id, material);
        setEditando(null);
      } else {
        await agregarMaterial(material);
      }
      cargarMateriales();
    } catch (e) {
      alert("Error guardando material");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este material?")) {
      try {
        await eliminarMaterial(id);
        cargarMateriales();
      } catch (e) {
        alert("Error eliminando material");
      }
    }
  };

  return (
    <div>
      <h2>Gestión de Materiales</h2>

      <MaterialForm
        onSubmit={handleAddOrUpdate}
        materialEditado={editando}
        cancelar={() => setEditando(null)}
      />

      {cargando && <p>Cargando materiales...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!cargando && !error && (
        <MaterialList
          materiales={materiales}
          onEditar={setEditando}
          onEliminar={handleDelete}
        />
      )}
    </div>
  );
};

export default Materiales;
