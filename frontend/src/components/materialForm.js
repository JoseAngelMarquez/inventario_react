import React, { useState, useEffect } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { FaEdit, FaTimes } from "react-icons/fa";

/**
 * Formulario para registrar o editar materiales.
 *
 * @component
 * @param {function} onSubmit - Función que se ejecuta al guardar el formulario.
 * @param {object|null} materialEditado - Objeto con los datos de un material para editar. Si es null, el formulario será para crear uno nuevo.
 * @param {function} cancelar - Función que se ejecuta al presionar "Cancelar" (solo visible cuando se edita un material).
 */
const MaterialForm = ({ onSubmit, materialEditado, cancelar }) => {
  // Estado principal del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "herramienta manual",
    cantidad_disponible: 0,
    descripcion: "",
    ubicacion: "",
  });

  // Estado adicional para cuando el usuario selecciona "Otro" en ubicación
  const [otroUbicacion, setOtroUbicacion] = useState("");

  /**
   * Efecto que se ejecuta cada vez que cambia `materialEditado`.
   * - Si hay material para editar, carga sus datos en el formulario.
   * - Si la ubicación no está en las opciones predefinidas, se considera "Otro".
   * - Si no hay material para editar, resetea el formulario.
   */
  useEffect(() => {
    if (materialEditado) {
      setFormData(materialEditado);

      // Lista de ubicaciones predefinidas
      const ubicacionesPredef = [
        "Husky Grande",
        "Husky Chico",
        ...Array.from({ length: 9 }, (_, i) => `Gabinete ${i + 1}`),
      ];

      // Si la ubicación no está en la lista, se asigna como "Otro"
      if (
        materialEditado.ubicacion !== "" &&
        !ubicacionesPredef.includes(materialEditado.ubicacion)
      ) {
        setOtroUbicacion(materialEditado.ubicacion);
        setFormData((prev) => ({ ...prev, ubicacion: "Otro" }));
      }
    } else {
      // Resetear formulario si no hay material en edición
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

  /**
   * Maneja los cambios en los inputs del formulario.
   * Convierte `cantidad_disponible` en número para evitar errores.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cantidad_disponible" ? Number(value) : value,
    }));
  };

  /**
   * Maneja el envío del formulario.
   * - Si la ubicación es "Otro", usa el valor del input `otroUbicacion`.
   * - Ejecuta la función `onSubmit` con los datos preparados.
   * - Si es un registro nuevo (no edición), resetea el formulario.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      ubicacion: formData.ubicacion === "Otro" ? otroUbicacion : formData.ubicacion,
    };

    onSubmit(dataToSubmit);

    if (!materialEditado) {
      // Resetear formulario al registrar nuevo material
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
      {/* Nombre */}
      <input
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      {/* Tipo de material */}
      <select name="tipo" value={formData.tipo} onChange={handleChange}>
        <option value="herramienta manual">Herramienta Manual</option>
        <option value="herramienta eléctrica">Herramienta Eléctrica</option>
        <option value="insumo">Insumo</option>
      </select>

      {/* Cantidad disponible */}
      <input
        type="number"
        name="cantidad_disponible"
        placeholder="Cantidad"
        value={formData.cantidad_disponible === 0 ? "" : formData.cantidad_disponible}
        onChange={handleChange}
        min={0}
        required
      />

      {/* Descripción */}
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

      {/* Input adicional cuando se selecciona "Otro" */}
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

      {/* Botón Cancelar (solo visible en edición) */}
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
