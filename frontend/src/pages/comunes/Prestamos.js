import React, { useState, useEffect } from 'react';
import { obtenerMateriales } from '../../services/materialService';
import { agregarPrestamo } from '../../services/prestamosService'; // usa tu service con axios

function FormPrestamo() {
  const [materiales, setMateriales] = useState([]);
  const [form, setForm] = useState({
    tipo: 'estudiante',
    nombre_completo: '',
    matricula: '',
    carrera: '',
    lugar_trabajo: '',
    telefono: '',
    correo: '',
    id_material: '',
    cantidad: 1,
    fecha_prestamo: new Date().toISOString().slice(0, 16),
    id_usuario: 1,
  });

  useEffect(() => {
    async function cargarMateriales() {
      try {
        const res = await obtenerMateriales();
        setMateriales(res.data);
      } catch (error) {
        console.error('Error cargando materiales:', error);
      }
    }
    cargarMateriales();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        fecha_prestamo: form.fecha_prestamo.replace('T', ' '),
      };
      const res = await agregarPrestamo(payload);
      alert(`Préstamo creado con ID ${res.data.id}`);
  
      // Aquí vuelves a cargar materiales actualizados
      const resMateriales = await obtenerMateriales();
      setMateriales(resMateriales.data);
  
      // También puedes limpiar el formulario si quieres
      setForm(prev => ({
        ...prev,
        id_material: '',
        cantidad: 1,
      }));
    } catch (error) {
      alert('Error al crear préstamo: ' + (error.response?.data?.message || error.message));
    }
  }
  

  return (
    <form onSubmit={handleSubmit}>
      {/* campos solicitante (tipo, nombre, matricula, etc.) */}
      <label>
        Tipo:
        <select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="estudiante">Estudiante</option>
          <option value="trabajador">Trabajador</option>
        </select>
      </label>

      <label>
        Nombre completo:
        <input type="text" name="nombre_completo" value={form.nombre_completo} onChange={handleChange} required />
      </label>

      {form.tipo === 'estudiante' && (
        <>
          <label>Matrícula:
            <input type="text" name="matricula" value={form.matricula} onChange={handleChange} />
          </label>
          <label>Carrera:
            <input type="text" name="carrera" value={form.carrera} onChange={handleChange} />
          </label>
        </>
      )}

      {form.tipo === 'trabajador' && (
        <label>
          Lugar de trabajo:
          <input type="text" name="lugar_trabajo" value={form.lugar_trabajo} onChange={handleChange} />
        </label>
      )}

      <label>Teléfono:
        <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} />
      </label>

      <label>Correo:
        <input type="email" name="correo" value={form.correo} onChange={handleChange} />
      </label>

      <h3>Datos del préstamo</h3>

      <label>Material:
        <select name="id_material" value={form.id_material} onChange={handleChange} required>
          <option value="">-- Selecciona un material --</option>
          {materiales.map(m => (
            <option key={m.id} value={m.id}>
              {m.nombre} ({m.cantidad_disponible} disponibles)
            </option>
          ))}
        </select>
      </label>

      <label>Cantidad:
        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          min={1}
          max={form.id_material ? materiales.find(m => m.id === +form.id_material)?.cantidad_disponible || 1 : 1}
          onChange={handleChange}
          required
        />
      </label>

      <label>Fecha préstamo:
        <input
          type="datetime-local"
          name="fecha_prestamo"
          value={form.fecha_prestamo}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Prestar</button>
    </form>
  );
}

export default FormPrestamo;
