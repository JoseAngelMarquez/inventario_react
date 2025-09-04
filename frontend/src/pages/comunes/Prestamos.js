import React, { useState, useEffect, useCallback } from 'react';
import { obtenerMateriales } from '../../services/materialService';
import { agregarPrestamo, obtenerPrestamos, finalizarPrestamo, filtrarPrestamos } from '../../services/prestamosService';
import "../../styles/Prestamos.css";
import FiltroPrestamos from '../../components/prestamos/FiltrosPrestamos';
import ListaPrestamos from '../../components/prestamos/ListaPrestamos';
import PrestamoForm from '../../components/prestamos/PrestamoForm';

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
            console.error('Error cargando materiales:', error);
        }
    };

    // Cargar préstamos y inicializar insumoTerminado
    const cargarPrestamos = useCallback(async () => {
        try {
            const res = await obtenerPrestamos();
            setPrestamos(res.data);

            // Inicializar insumoTerminado para los préstamos tipo 'insumo' prestados
            const inicial = {};
            res.data.forEach(p => {
                if (p.tipo_material === 'insumo' && p.estado === 'prestado') {
                    inicial[p.id] = insumoTerminado[p.id] || false;
                }
            });
            setInsumoTerminado(prev => ({ ...inicial, ...prev }));
        } catch (error) {
            console.error(error);
        }
    }, [insumoTerminado]);

    // useEffect para cargar materiales y préstamos al montar
    useEffect(() => {
        cargarMateriales();
        cargarPrestamos();
    }, [cargarPrestamos]);

    // Filtrar préstamos cuando cambian los filtros
    useEffect(() => {
        filtrarPrestamos(filtros).then(res => setPrestamos(res.data));
    }, [filtros]);

    const handleBuscar = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, fecha_prestamo: form.fecha_prestamo.replace('T', ' ') };
            const res = await agregarPrestamo(payload);
            alert(`Préstamo creado con ID ${res.data.id}`);

            // Recargar datos
            await cargarMateriales();
            await cargarPrestamos();

            // Reset parcial del formulario
            setForm(prev => ({ ...prev, id_material: '', cantidad: 1 }));
        } catch (error) {
            alert('Error al crear préstamo: ' + (error.response?.data?.detalle || error.message));
        }
    };

    const handleFinalizar = async (id) => {
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
    };

    return (
        <>
            <PrestamoForm
                form={form}
                materiales={materiales}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            <hr />

            <FiltroPrestamos 
                filtros={filtros} 
                onChange={handleBuscar} 
            />

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
