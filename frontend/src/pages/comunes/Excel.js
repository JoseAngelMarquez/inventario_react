// src/pages/PrestamosReporte.js
import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { obtenerReporteCompleto, filtrarPrestamosPorFecha } from '../../services/prestamosService';
import { FaFileExport } from "react-icons/fa6";
import { descargarExcelPrestamos } from '../../services/prestamosService';

export default function PrestamosReporte() {
  const [prestamos, setPrestamos] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");

  // Al cargar la página, obtener todos los préstamos
  useEffect(() => {
    const cargarPrestamos = async () => {
      try {
        const res = await obtenerReporteCompleto();
        setPrestamos(res.data);
      } catch (err) {
        //console.error(err);
      }
    };

    cargarPrestamos();
  }, []);

  // Función para formatear fecha a hora de México
  const formatoMexico = (fecha) => {
    return new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(fecha));
  };

  // Función para filtrar préstamos por fecha
  const aplicarFiltroFecha = async () => {
    try {
      let res;
      if (!fechaFiltro) {
        res = await obtenerReporteCompleto();
      } else {
        res = await filtrarPrestamosPorFecha(fechaFiltro);
      }
      setPrestamos(res.data);
    } catch (err) {
      //console.error(err);
    }
  };

  // Estructura de datos para Excel

  const exportarExcelDesdeBackend = async () => {
    try {
      const response = await descargarExcelPrestamos();
      saveAs(new Blob([response.data]), "Prestamos.xlsx");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
    }
  };

  //Exportar desde frontend (librería XLSX)

  /* 
        const exportarExcelPorFecha = () => {
          const libro = XLSX.utils.book_new();
      
          const datosParaExcel = prestamos.map(({ nombre_solicitante, prestamista, finalizador, cantidad, fecha_prestamo, fecha_devolucion, tipo_material, nombre_material }) => ({
            Solicitante: nombre_solicitante,
            Prestamista: prestamista,
            Finalizador: finalizador || 'No finalizado',
            Cantidad: cantidad,
            FechaPrestamo: formatoMexico(fecha_prestamo),
            TipoMaterial: tipo_material,
            Nombre: nombre_material || 'Sin nombre',
            Devolucion: fecha_devolucion ? formatoMexico(fecha_devolucion) : 'No devuelto',
          }));
      
              // Crear hoja y archivo Excel
      
          const hoja = XLSX.utils.json_to_sheet(datosParaExcel);
          XLSX.utils.book_append_sheet(libro, hoja, "Préstamos");
          const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
          const archivo = new Blob([excelBuffer], { type: 'application/octet-stream' });
          saveAs(archivo, 'prestamos_por_fecha.xlsx');
        };
   */
  return (
    <div>
      <h1>Reporte de Préstamos</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="date"
          value={fechaFiltro}
          onChange={e => setFechaFiltro(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={aplicarFiltroFecha} style={{ marginRight: '10px' }}>Filtrar</button>
        <button onClick={exportarExcelDesdeBackend}>
          <FaFileExport style={{ marginRight: '5px' }} />
          Exportar Excel
        </button>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Solicitante</th>
            <th>Prestamista</th>
            <th>Finalizador</th>
            <th>Cantidad</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
            <th>Tipo Material</th>
            <th>Nombre Material</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre_solicitante}</td>
              <td>{p.usuario_prestamista}</td>
              <td>{p.usuario_finalizador || 'No finalizado'}</td>
              <td>{p.cantidad}</td>
              <td>{formatoMexico(p.fecha_prestamo)}</td>
              <td>{p.fecha_devolucion ? formatoMexico(p.fecha_devolucion) : 'No devuelto'}</td>
              <td>{p.tipo_material}</td>
              <td>{p.nombre_material}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
