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

    // --- Persistencia de insumoTerminado ---
    useEffect(() => {
        const guardado = localStorage.getItem('insumoTerminado');
        if (guardado) setInsumoTerminado(JSON.parse(guardado));
    }, []);

    useEffect(() => {
        localStorage.setItem('insumoTerminado', JSON.stringify(insumoTerminado));
    }, [insumoTerminado]);

    // Cargar materiales
    const cargarMateriales = async () => {
        try {
            const res = await obtenerMateriales();
            setMateriales(res.data);
        } catch (error) {
            console.error('Error cargando materiales:', error);
        }
    };

    // Cargar préstamos filtrados y mantener los checkboxes
    const cargarPrestamosFiltrados = useCallback(async () => {
        try {
            let res;
            if (filtros.solicitante || filtros.material || filtros.fecha) {
                res = await filtrarPrestamos(filtros);
            } else {
                res = await obtenerPrestamos();
            }

            setPrestamos(res.data);

            // Mantener los valores previos de insumoTerminado y asegurar que todos los préstamos tengan un valor
            setInsumoTerminado(prev => {
                const nuevo = { ...prev };
                res.data.forEach(p => {
                    if (p.tipo_material === 'insumo' && p.estado === 'prestado') {
                        if (!(p.id in nuevo)) nuevo[p.id] = false; // si no existe, agregar false
                    }
                });
                return nuevo;
            });
        } catch (error) {
            console.error(error);
        }
    }, [filtros]);

    // Cargar materiales y préstamos al montar
    useEffect(() => {
        cargarMateriales();
        cargarPrestamosFiltrados();
    }, [cargarPrestamosFiltrados]);

    const handleBuscar = (e) => {
        setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
            await cargarPrestamosFiltrados();

            // Reset parcial del formulario
            setForm(prev => ({ ...prev, id_material: '', cantidad: 1 }));
        } catch (error) {
            alert('Error al crear préstamo: ' + (error.response?.data?.detalle || error.message));
        }
    };

    const handleFinalizar = async (id) => {
        // Buscar el préstamo correspondiente
        const prestamo = prestamos.find(p => p.id === id);
        if (!prestamo) return;
    
        // Confirmación general
        if (!window.confirm('¿Seguro que deseas finalizar este préstamo?')) return;
    
        try {
            let cantidadDevuelta = null;
    
            // Si es insumo y cantidad > 1, preguntar cuántos regresan
            if (prestamo.tipo_material === 'insumo' && prestamo.cantidad > 1) {
                const input = prompt(`Este préstamo tiene ${prestamo.cantidad} insumos. ¿Cuántos se regresan?`, prestamo.cantidad);
                if (input === null) return; // canceló
                const cantidadNum = parseInt(input, 10);
                if (isNaN(cantidadNum) || cantidadNum < 0 || cantidadNum > prestamo.cantidad) {
                    alert('Cantidad inválida');
                    return;
                }
                cantidadDevuelta = cantidadNum;
            }
    
            await finalizarPrestamo(id, insumoTerminado[id] || false, cantidadDevuelta);
    
            alert('Préstamo finalizado correctamente');
            await cargarPrestamosFiltrados();
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
