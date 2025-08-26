import React, { useState, useEffect } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const MaterialForm = ({ onSubmit, materialEditado, cancelar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "herramienta manual",
    cantidad_disponible: 0,
    descripcion: "",
  });

  useEffect(() => {
    if (materialEditado) {
      setFormData(materialEditado);
    } else {
      setFormData({
        nombre: "",
        tipo: "herramienta manual",
        cantidad_disponible: 0,
        descripcion: "",
      });
    }
  }, [materialEditado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cantidad_disponible" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!materialEditado) {
      setFormData({
        nombre: "",
        tipo: "herramienta manual",
        cantidad_disponible: 0,
        descripcion: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />
      <select name="tipo" value={formData.tipo} onChange={handleChange}>
        <option value="herramienta manual">Herramienta Manual</option>
        <option value="herramienta eléctrica">Herramienta Eléctrica</option>
        <option value="insumo">Insumo</option>
      </select>
      <input
  type="number"
  name="cantidad_disponible"
  placeholder="Cantidad"
  value={formData.cantidad_disponible === 0 ? "" : formData.cantidad_disponible}
  onChange={handleChange}
  min={0}
  required
/>

      <input
        name="descripcion"
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={handleChange}
        required
      />
       {/* Botón Guardar / Actualizar */}
       <button type="submit" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {materialEditado ? (
          <>
            <FaEdit /> Actualizar
          </>
        ) : (
          <>
            <CiSaveDown2 /> Guardar
          </>
        )}
      </button>

      {/* Botón Cancelar */}
      {materialEditado && (
        <button
          type="button"
          onClick={cancelar}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <FaTimes /> Cancelar
        </button>
      )}
    </form>
  );
};

export default MaterialForm;
