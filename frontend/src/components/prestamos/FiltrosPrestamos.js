import React from 'react';

function FiltrosPrestamos({ filtros, setFiltros }) {

    const handleBuscar = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="filtros-prestamos">
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
        </div>
    );
}

export default FiltrosPrestamos;
