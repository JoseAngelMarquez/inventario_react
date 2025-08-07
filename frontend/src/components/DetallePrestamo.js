import React from 'react';

function DetallePrestamo({ prestamo, onFinalizar }) {
    if (!prestamo) return <p>No hay préstamo activo.</p>;

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h3>Detalle del Préstamo</h3>
            <p><strong>Nombre:</strong> {prestamo.nombre_completo}</p>
            <p><strong>Tipo:</strong> {prestamo.tipo}</p>
            {prestamo.tipo === 'estudiante' && (
                <>
                    <p><strong>Matrícula:</strong> {prestamo.matricula}</p>
                    <p><strong>Carrera:</strong> {prestamo.carrera}</p>
                </>
            )}
            {prestamo.tipo === 'trabajador' && (
                <p><strong>Lugar de trabajo:</strong> {prestamo.lugar_trabajo}</p>
            )}
            <p><strong>Teléfono:</strong> {prestamo.telefono}</p>
            <p><strong>Correo:</strong> {prestamo.correo}</p>
            <p><strong>Material ID:</strong> {prestamo.id_material}</p>
            <p><strong>Cantidad:</strong> {prestamo.cantidad}</p>
            <p><strong>Fecha del préstamo:</strong> {prestamo.fecha_prestamo}</p>

            <button onClick={() => onFinalizar(prestamo.id)}>Finalizar préstamo</button>
        </div>
    );
}

export default DetallePrestamo;
