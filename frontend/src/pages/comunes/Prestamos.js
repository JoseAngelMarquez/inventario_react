import React, { useState, useEffect } from 'react';
import { obtenerMateriales } from '../../services/materialService';
import { agregarPrestamo, obtenerPrestamos, finalizarPrestamo, filtrarPrestamos } from '../../services/prestamosService';
import "../../styles/Prestamos.css";
import { PiHandSwipeRightFill } from "react-icons/pi";
import FiltroPrestamos from '../../components/prestamos/FiltrosPrestamos';
import ListaPrestamos from '../../components/prestamos/ListaPrestamos';

function FormPrestamo() {
    const [materiales, setMateriales] = useState([]);
    const [prestamos, setPrestamos] = useState([]);
    const [filtros, setFiltros] = useState({ solicitante: "", material: "", fecha: "" });
    const [insumoTerminado, setInsumoTerminado] = useState({});

    const [form, setForm] = useState({
        tipo: 'estudiante',
        nombre_completo: '',
        matricula: '',
        carrera: '',
        lugar_trabajo: '',
        numero_empleado: '',
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
            //console.error('Error cargando materiales:', error);
        }
    };

    // Cargar préstamos
    const cargarPrestamos = async () => {
        try {
            const res = await obtenerPrestamos();
            setPrestamos(res.data);
        } catch (error) {
            //console.error('Error cargando préstamos:', error);
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
            await finalizarPrestamo(id, insumoTerminado[id] || false);
            alert('Préstamo finalizado correctamente');
            await cargarPrestamos();
            await cargarMateriales();
            // Limpiar la casilla después de finalizar
            setInsumoTerminado(prev => ({ ...prev, [id]: false }));
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
                    <input
                        type="text"
                        name="nombre_completo"
                        value={form.nombre_completo}
                        onChange={handleChange}
                        required
                        pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"
                        title="Solo letras y espacios permitidos" />

                </label>

                {form.tipo === 'estudiante' && (
                    <>
                        <label>
                            Matrícula:
                            <input type="text" name="matricula" value={form.matricula} onChange={handleChange} pattern="[0-9]+"
                                title="Solo números permitidos (sin espacios)" />
                        </label>
                        <label>
                            Carrera:
                            <input type="text"
                                name="carrera"
                                value={form.carrera}
                                onChange={handleChange}
                                pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"
                                title="Solo letras y espacios permitidos" />
                        </label>
                    </>
                )}

                {form.tipo === 'trabajador' && (
                    <>
                        <label>
                            Lugar de trabajo:
                            <input type="text" name="lugar_trabajo" value={form.lugar_trabajo} onChange={handleChange} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"
                                title="Solo letras y espacios permitidos" />
                        </label>
                        <label>
                            Número de empleado:
                            <input type="text" name="numero_empleado" value={form.numero_empleado} onChange={handleChange} pattern="[0-9]+"
                                title="Solo números permitidos (sin espacios)" />
                        </label>
                    </>
                )}

                <label>
                    Teléfono:
                    <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} pattern="[0-9]+"
                        title="Solo números permitidos (sin espacios)" />
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

            <FiltroPrestamos filtros={filtros} onChange={handleBuscar} />

            <ListaPrestamos
                prestamos={prestamos}
                insumoTerminado={insumoTerminado}
                setInsumoTerminado={setInsumoTerminado}
                onFinalizar={handleFinalizar}
            />
        </>
    );
}

export default FormPrestamo;
