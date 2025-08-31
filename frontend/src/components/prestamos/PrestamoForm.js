import React from 'react';
import { PiHandSwipeRightFill } from "react-icons/pi";

function PrestamoForm({ form, materiales, handleChange, handleSubmit }) {
    return (
        <form onSubmit={handleSubmit}>
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
                    pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"
                    title="Solo letras y espacios permitidos"
                />
            </label>

            {form.tipo === 'estudiante' && (
                <>
                    <label>
                        Matrícula:
                        <input
                            type="text"
                            name="matricula"
                            value={form.matricula}
                            onChange={handleChange}
                            pattern="[0-9]+"
                            title="Solo números permitidos (sin espacios)"
                        />
                    </label>
                    <label>
                        Carrera:
                        <input
                            type="text"
                            name="carrera"
                            value={form.carrera}
                            onChange={handleChange}
                            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"
                            title="Solo letras y espacios permitidos"
                        />
                    </label>
                </>
            )}

            {form.tipo === 'trabajador' && (
                <>
                    <label>
                        Lugar de trabajo:
                        <input
                            type="text"
                            name="lugar_trabajo"
                            value={form.lugar_trabajo}
                            onChange={handleChange}
                            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"
                            title="Solo letras y espacios permitidos"
                        />
                    </label>
                    <label>
                        Número de empleado:
                        <input
                            type="text"
                            name="numero_empleado"
                            value={form.numero_empleado}
                            onChange={handleChange}
                            pattern="[0-9]+"
                            title="Solo números permitidos (sin espacios)"
                        />
                    </label>
                </>
            )}

            <label>
                Teléfono:
                <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    pattern="[0-9]+"
                    title="Solo números permitidos (sin espacios)"
                />
            </label>

            <label>
                Correo:
                <input type="email" name="correo" value={form.correo} onChange={handleChange} />
            </label>

            <h3>Datos del préstamo</h3>

            <label>
                Material:
                <select name="id_material" value={form.id_material} onChange={handleChange} required>
                    <option value="">-- Selecciona un material --</option>
                    {materiales.filter(m => m.cantidad_disponible > 0).map(m => (
                        <option key={m.id} value={m.id}>
                            {m.nombre} ({m.cantidad_disponible} disponibles)
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Cantidad:
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

            <button
                type="submit"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                }}
            >
                <PiHandSwipeRightFill style={{ fontSize: "15px" }} />
                Prestar
            </button>
        </form>
    );
}

export default PrestamoForm;
