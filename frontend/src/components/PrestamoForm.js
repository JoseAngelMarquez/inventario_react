import React, { useState, useEffect } from "react";

const PrestamoForm = ({ materiales, onSubmit, cancelar }) => {
  const tiposUnicos = [...new Set(materiales.map((m) => m.tipo))];

  const [formData, setFormData] = useState({
    tipoMaterial: "",
    idMaterial: "",
    cantidadDisponible: 0,
    cantidad: 1,
    tipoSolicitante: "estudiante",
    nombre: "",
    matricula: "",
    carrera: "",
    lugarTrabajo: "",
    telefono: "",
    correo: "",
  });

  const materialesFiltrados = formData.tipoMaterial
    ? materiales.filter((m) => m.tipo === formData.tipoMaterial)
    : [];

  useEffect(() => {
    const mat = materiales.find((m) => m.id === formData.idMaterial);
    if (mat) {
      setFormData((prev) => ({
        ...prev,
        cantidadDisponible: mat.cantidad_disponible,
        cantidad: Math.min(prev.cantidad, mat.cantidad_disponible) || 1,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        cantidadDisponible: 0,
        cantidad: 1,
      }));
    }
  }, [formData.idMaterial, materiales]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cantidad") {
      let val = parseInt(value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > formData.cantidadDisponible) val = formData.cantidadDisponible;
      setFormData((prev) => ({ ...prev, cantidad: val }));
      return;
    }

    if (name === "tipoMaterial") {
      setFormData((prev) => ({
        ...prev,
        tipoMaterial: value,
        idMaterial: "",
        cantidadDisponible: 0,
        cantidad: 1,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.idMaterial) {
      alert("Selecciona un material");
      return;
    }
    if (!formData.nombre || !formData.telefono || !formData.correo) {
      alert("Completa los datos del solicitante");
      return;
    }
    if (
      formData.tipoSolicitante === "estudiante" &&
      (!formData.matricula || !formData.carrera)
    ) {
      alert("Completa matrícula y carrera");
      return;
    }
    if (formData.tipoSolicitante === "trabajador" && !formData.lugarTrabajo) {
      alert("Completa lugar de trabajo");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Material</h3>

      <label>
        Tipo de material:
        <select
          name="tipoMaterial"
          value={formData.tipoMaterial}
          onChange={handleChange}
          required
        >
          <option value="">-- Selecciona tipo --</option>
          {tiposUnicos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </label>

      <label>
        Material:
        <select
          name="idMaterial"
          value={formData.idMaterial}
          onChange={handleChange}
          required
          disabled={!formData.tipoMaterial}
        >
          <option value="">-- Selecciona material --</option>
          {materialesFiltrados.map((mat) => (
            <option key={mat.id} value={mat.id}>
              {mat.nombre} (Disponible: {mat.cantidad_disponible})
            </option>
          ))}
        </select>
      </label>

      <div>
        <label>Cantidad a prestar:</label>
        <input
          type="number"
          name="cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          min="1"
          max={formData.cantidadDisponible || 1}
          required
        />
      </div>

      <h3>Datos del solicitante</h3>

      <label>
        Tipo de solicitante:
        <select
          name="tipoSolicitante"
          value={formData.tipoSolicitante}
          onChange={handleChange}
        >
          <option value="estudiante">Estudiante</option>
          <option value="trabajador">Trabajador</option>
        </select>
      </label>

      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      {formData.tipoSolicitante === "estudiante" ? (
        <>
          <div>
            <label>Matrícula:</label>
            <input
              type="text"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Carrera:</label>
            <input
              type="text"
              name="carrera"
              value={formData.carrera}
              onChange={handleChange}
              required
            />
          </div>
        </>
      ) : (
        <div>
          <label>Lugar de trabajo:</label>
          <input
            type="text"
            name="lugarTrabajo"
            value={formData.lugarTrabajo}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div>
        <label>Teléfono:</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Correo:</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" style={{ marginTop: 10 }}>
        Agregar préstamo
      </button>
      <button
        type="button"
        onClick={cancelar}
        style={{ marginLeft: 10, marginTop: 10 }}
      >
        Cancelar
      </button>
    </form>
  );
};

export default PrestamoForm;
