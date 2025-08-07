import React, { useState, useEffect } from 'react';

function FormPrestamo() {
  // Estado para los materiales (para el select)
  const [materiales, setMateriales] = useState([]);

  // Estado del formulario
  const [form, setForm] = useState({
    tipo: 'estudiante', // o trabajador
    nombre_completo: '',
    matricula: '',
    carrera: '',
    lugar_trabajo: '',
    telefono: '',
    correo: '',
    id_material: '',
    cantidad: 1,
    fecha_prestamo: new Date().toISOString().slice(0,16), // YYYY-MM-DDTHH:mm para input datetime-local
    id_usuario: 1, // Ejemplo fijo, mejor si lo obtienes de sesión/autenticación
  });

  // Cargar materiales al montar el componente
  useEffect(() => {
    fetch('/api/materiales') // Asumiendo que tienes ese endpoint
      .then(res => res.json())
      .then(data => setMateriales(data))
      .catch(err => console.error('Error al cargar materiales', err));
  }, []);

  // Manejar cambios en inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Enviar formulario
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Convierte la fecha para que no tenga segundos ni zona horaria (opcional según backend)
      const payload = {
        ...form,
        fecha_prestamo: form.fecha_prestamo.replace('T', ' '), // "YYYY-MM-DD HH:mm"
      };

      const res = await fetch('/api/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al crear préstamo');

      const data = await res.json();
      alert(`Préstamo creado con ID ${data.id}`);
      // Aquí puedes limpiar el formulario o redirigir
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Datos del solicitante</h2>
      <label>
        Tipo:
        <select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="estudiante">Estudiante</option>
          <option value="trabajador">Trabajador</option>
        </select>
      </label>

      <label>
        Nombre completo:
        <input
          type="text"
          name="nombre_completo"
          value={form.nombre_completo}
          onChange={handleChange}
          required
        />
      </label>

      {form.tipo === 'estudiante' && (
        <>
          <label>
            Matrícula:
            <input type="text" name="matricula" value={form.matricula} onChange={handleChange} />
          </label>
          <label>
            Carrera:
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

      <label>
        Teléfono:
        <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} />
      </label>

      <label>
        Correo:
        <input type="email" name="correo" value={form.correo} onChange={handleChange} />
      </label>

      <h2>Datos del préstamo</h2>

      <label>
        Material:
        <select
          name="id_material"
          value={form.id_material}
          onChange={handleChange}
          required
        >
          <option value="">-- Selecciona un material --</option>
          {materiales.map(mat => (
            <option key={mat.id} value={mat.id}>{mat.nombre}</option>
          ))}
        </select>
      </label>

      <label>
        Cantidad:
        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          min="1"
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Fecha préstamo:
        <input
          type="datetime-local"
          name="fecha_prestamo"
          value={form.fecha_prestamo}
          onChange={handleChange}
          required
        />
      </label>

      {/* id_usuario normalmente lo sacas del contexto o sesión */}

      <button type="submit">Prestar</button>
    </form>
  );
}

export default FormPrestamo;
