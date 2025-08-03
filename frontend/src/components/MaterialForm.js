// src/components/MaterialForm.js
import React, { useState, useEffect } from "react";

const MaterialForm = ({ onSubmit, materialEditado, cancelar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "herramienta manual",
    cantidad_disponible: 0,
    descripcion: "",
  });

  useEffect(() => {
    if (materialEditado) setFormData(materialEditado);
  }, [materialEditado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nombre: "",
      tipo: "herramienta manual",
      cantidad_disponible: 0,
      descripcion: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
      <select name="tipo" value={formData.tipo} onChange={handleChange}>
        <option value="herramienta manual">Herramienta Manual</option>
        <option value="herramienta eléctrica">Herramienta Eléctrica</option>
        <option value="insumo">Insumo</option>
      </select>
      <input type="number" name="cantidad_disponible" placeholder="Cantidad" value={formData.cantidad_disponible} onChange={handleChange} required />
      <input name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} />
      <button type="submit">Guardar</button>
      {materialEditado && <button type="button" onClick={cancelar}>Cancelar</button>}
    </form>
  );
};

export default MaterialForm;
