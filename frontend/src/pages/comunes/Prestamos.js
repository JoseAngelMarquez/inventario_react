import React, { useState, useEffect } from 'react';
import { obtenerMateriales } from '../../services/materialService';
import { agregarPrestamo, obtenerPrestamos, finalizarPrestamo, filtrarPrestamos } from '../../services/prestamosService';
import "../../styles/Prestamos.css";
import { PiHandSwipeRightFill } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";


function FormPrestamo() {
    const [materiales, setMateriales] = useState([]);
    const [prestamos, setPrestamos] = useState([]);
    const [filtros, setFiltros] = useState({ solicitante: "", material: "", fecha: "" });

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
        fecha_prestamo: new Date().toLocaleString('sv-SE', { hour12: false }).replace(' ', 'T'),
    });

    // Cargar materiales
    const cargarMateriales = async () => {
        try {
            const res = await obtenerMateriales();
            setMateriales(res.data);
        } catch (error) {
            console.error('Error cargando materiales:', error);
        }
    };

    // Cargar préstamos
    const cargarPrestamos = async () => {
        try {
            const res = await obtenerPrestamos();
            setPrestamos(res.data);
        } catch (error) {
            console.error('Error cargando préstamos:', error);
        }
    };

    useEffect(() => {
        cargarMateriales();
        cargarPrestamos();
    }, []);


    useEffect(() => {
        filtrarPrestamos(filtros).then((res) => {
            setPrestamos(res.data);
        });
    }, [filtros]);

    const handleBuscar = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value,
        });
    };
    // Manejo de cambios en el formulario
    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }


    // Crear préstamo
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                fecha_prestamo: form.fecha_prestamo.replace('T', ' '),
            };

            const res = await agregarPrestamo(payload);
            alert(`Préstamo creado con ID ${res.data.id}`);

            // Recargar datos
            await cargarMateriales();
            await cargarPrestamos();

            // Reset parcial del formulario
            setForm(prev => ({
                ...prev,
                id_material: '',
                cantidad: 1,
            }));
        } catch (error) {
            alert('Error al crear préstamo: ' + (error.response?.data?.detalle || error.message));
        }
    }

    // Finalizar préstamo
    async function handleFinalizar(id) {
        if (!window.confirm('¿Seguro que deseas finalizar este préstamo?')) return;
        try {
            await finalizarPrestamo(id);
            alert('Préstamo finalizado correctamente');
            await cargarPrestamos();
            await cargarMateriales();
        } catch (error) {
            alert('Error al finalizar préstamo: ' + (error.response?.data?.detalle || error.message));
        }
    }

    return (
        <>
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
                    <input type="text" name="nombre_completo" value={form.nombre_completo} onChange={handleChange} required />
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

            <hr />
            <input
                type="text"
                name="solicitante"
                value={filtros.solicitante}
                onChange={handleBuscar}
                placeholder="Buscar por nombre"
            />

            <input
                type="text"
                name="material"
                value={filtros.material}
                onChange={handleBuscar}
                placeholder="Buscar por material"
            />

            <input
                type="date"
                name="fecha"
                value={filtros.fecha}
                onChange={handleBuscar}
            />
            <h2>Lista de Préstamos</h2>
            {prestamos.length === 0 ? (
                <p>No hay préstamos registrados.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Material</th>
                            <th>Cantidad</th>
                            <th>Fecha préstamo</th>
                            <th>Estado</th>
                            <th>Prestamista</th>
                            <th>Finalizador</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prestamos.map(prestamo => (
                            <tr key={prestamo.id}>
                                <td>{prestamo.nombre_solicitante}</td>
                                <td>{prestamo.tipo_solicitante}</td>
                                <td>{prestamo.nombre_material}</td>
                                <td>{prestamo.cantidad}</td>
                                <td>{new Date(prestamo.fecha_prestamo).toLocaleString()}</td>
                                <td>{prestamo.estado}</td>
                                <td>{prestamo.usuario_prestamista || '—'}</td>
                                <td>{prestamo.usuario_finalizador || '—'}</td>
                                <td>
                                    {prestamo.estado === 'prestado' && (
                                        <button onClick={() => handleFinalizar(prestamo.id)} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px"
                                        }}>
                                            <FaCheck style={{ fontSize: "10px" }} />
                                            Finalizar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default FormPrestamo;
