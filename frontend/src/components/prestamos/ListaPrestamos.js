import React from "react";
import { FaCheck } from "react-icons/fa";

function ListaPrestamos({ prestamos, insumoTerminado, setInsumoTerminado, onFinalizar }) {
    return (
        <>
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
                                <td>
                                    {prestamo.nombre_solicitante || '—'} <br />
                                    {prestamo.tipo_solicitante === 'estudiante'
                                        ? `Matrícula: ${prestamo.matricula || '—'}`
                                        : `Número de empleado: ${prestamo.numero_empleado_solicitante || '—'}`}
                                </td>
                                <td>{prestamo.tipo_solicitante}</td>
                                <td>{prestamo.nombre_material}</td>
                                <td>{prestamo.cantidad}</td>
                                <td>{new Date(prestamo.fecha_prestamo).toLocaleString()}</td>
                                <td>{prestamo.estado}</td>
                                <td>{prestamo.usuario_prestamista || '—'}</td>
                                <td>{prestamo.usuario_finalizador || '—'}</td>
                                <td>
                                    {prestamo.estado === 'prestado'
                                        && prestamo.tipo_material?.toLowerCase() === 'insumo'
                                        && prestamo.cantidad === 1 && (   // <-- nueva condición
                                            <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={insumoTerminado[prestamo.id] || false}
                                                    onChange={(e) =>
                                                        setInsumoTerminado(prev => ({
                                                            ...prev,
                                                            [prestamo.id]: e.target.checked
                                                        }))
                                                    }
                                                />
                                                Insumo terminado
                                            </label>
                                        )}


                                    {prestamo.estado === 'prestado' && (
                                        <button
                                            onClick={() => onFinalizar(prestamo.id)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                                marginTop: "4px"
                                            }}
                                        >
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

export default ListaPrestamos;
