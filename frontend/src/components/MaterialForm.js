import React, { useState, useEffect } from "react";

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
        value={formData.cantidad_disponible}
        onChange={handleChange}
        min={0}
        required
      />
      <input
        name="descripcion"
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={handleChange}
      />
      <button type="submit">{materialEditado ? "Actualizar" : "Guardar"}</button>
      {materialEditado && (
        <button type="button" onClick={cancelar}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default MaterialForm;
