import React, { useEffect, useState } from "react";
import MaterialForm from "../../components/materialForm";
import MaterialList from "../../components/MaterialList";
import SearchInput from "../../components/UI/InputBusqueda";

import {
  obtenerMateriales,
  agregarMaterial,
  actualizarMaterial,
  eliminarMaterial,
  filtrarMaterialPorNombre,
} from "../../services/materialService";

const Materiales = () => {
  const [materiales, setMateriales] = useState([]);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      try {
        if (busqueda.trim() === "") {
          await cargarMateriales();
        } else {
          const res = await filtrarMaterialPorNombre(busqueda);
          setMateriales(res.data);
        }
      } catch (error) {
        //console.error("Error en búsqueda:", error);
        setError("Error en la búsqueda");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [busqueda]);

  const handleAddOrUpdate = async (material) => {
    try {
      if (editando) {
        const res = await actualizarMaterial(editando.id, material);
        alert(res.data.message); // mensaje del backend
        setEditando(null);
      } else {
        const res = await agregarMaterial(material);
        alert(res.data.message); // mensaje del backend
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

      <SearchInput
        value={busqueda}
        onChange={setBusqueda}
        placeholder="Buscar material..."
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
