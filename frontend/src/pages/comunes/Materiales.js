import React, { useEffect, useState } from "react";
import MaterialForm from "../../components/materialForm";
import MaterialList from "../../components/MaterialList";
import SearchInput from "../../components/UI/InputBusqueda";
import { descargarExcelMateriales } from "../../services/materialService";

import {
  obtenerMateriales,
  agregarMaterial,
  actualizarMaterial,
  eliminarMaterial,
  filtrarMaterialPorNombre,
} from "../../services/materialService";
import { saveAs } from "file-saver";

const Materiales = () => {
  const [materiales, setMateriales] = useState([]);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Cargar todos los materiales desde el backend

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

  // Cuando se carga el componente, traer los materiales

  useEffect(() => {
    cargarMateriales();
  }, []);


  // Cada vez que cambia la búsqueda, volver a cargar datos (filtrados o no)

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

  // Agregar o actualizar material

  const handleAddOrUpdate = async (material) => {
    try {
      if (editando) {
        // Si hay un material en edición - actualizar
        const res = await actualizarMaterial(editando.id, material);
        alert(res.data.message); // mensaje del backend
        setEditando(null);
      } else {
        // Si no → agregar nuevo
        const res = await agregarMaterial(material);
        alert(res.data.message); // mensaje del backend
      }
      cargarMateriales();
    } catch (e) {
      alert("Error guardando material");
    }
  };

  // Eliminar material

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

  const exportarExcelDesdeBackend = async () => {
    try {
      const response = await descargarExcelMateriales();
      saveAs(new Blob([response.data]), "materiales.xlsx");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
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
      <button onClick={exportarExcelDesdeBackend}>
        Exportar Excel
      </button>

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
