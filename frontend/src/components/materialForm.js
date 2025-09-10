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
    ubicacion: "",
  });

  const [otroUbicacion, setOtroUbicacion] = useState(""); // estado para "otro"

  useEffect(() => {
    if (materialEditado) {
      setFormData(materialEditado);
      if (
        materialEditado.ubicacion !== "" &&
        ![
          "Husky Grande",
          "Husky Chico",
          ...Array.from({ length: 9 }, (_, i) => `Gabinete ${i + 1}`),
        ].includes(materialEditado.ubicacion)
      ) {
        setOtroUbicacion(materialEditado.ubicacion);
        setFormData((prev) => ({ ...prev, ubicacion: "Otro" }));
      }
    } else {
      setFormData({
        nombre: "",
        tipo: "herramienta manual",
        cantidad_disponible: 0,
        descripcion: "",
        ubicacion: "",
      });
      setOtroUbicacion("");
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

    const dataToSubmit = {
      ...formData,
      ubicacion: formData.ubicacion === "Otro" ? otroUbicacion : formData.ubicacion,
    };

    onSubmit(dataToSubmit);

    if (!materialEditado) {
      setFormData({
        nombre: "",
        tipo: "herramienta manual",
        cantidad_disponible: 0,
        descripcion: "",
        ubicacion: "",
      });
      setOtroUbicacion("");
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

      {/* Select de ubicación */}
      <select
        name="ubicacion"
        value={formData.ubicacion}
        onChange={handleChange}
        required
      >
        <option value="">-- Selecciona ubicación --</option>
        {Array.from({ length: 9 }, (_, i) => (
          <option key={`gabinete-${i + 1}`} value={`Gabinete ${i + 1}`}>
            Gabinete {i + 1}
          </option>
        ))}
        <option value="Husky Grande">Husky Grande</option>
        <option value="Husky Chico">Husky Chico</option>
        <option value="Otro">Otro</option>
      </select>

      {/* Si elige "Otro", mostrar input */}
      {formData.ubicacion === "Otro" && (
        <input
          type="text"
          placeholder="Especifica ubicación"
          value={otroUbicacion}
          onChange={(e) => setOtroUbicacion(e.target.value)}
          required
        />
      )}

      {/* Botón Guardar / Actualizar */}
      <button
        type="submit"
        style={{ display: "flex", alignItems: "center", gap: "6px" }}
      >
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
