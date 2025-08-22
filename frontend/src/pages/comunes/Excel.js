// src/pages/PrestamosReporte.js
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { obtenerReporteCompleto } from "../../services/prestamosService";
import { FaFileExport } from "react-icons/fa6";

export default function PrestamosReporte() {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    obtenerReporteCompleto()
      .then(res => setPrestamos(res.data))
      .catch(err => console.error(err));
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

  const exportarExcelPorFecha = () => {
    const fechasUnicas = [...new Set(prestamos.map(p => {
      const fecha = new Date(p.fecha_prestamo);
      return fecha.toISOString().split('T')[0];
    }))];

    const libro = XLSX.utils.book_new();

    fechasUnicas.forEach(fecha => {
      const datosFiltrados = prestamos.filter(p => {
        const fechaPrestamo = new Date(p.fecha_prestamo).toISOString().split('T')[0];
        return fechaPrestamo === fecha;
      });

      const datosParaExcel = datosFiltrados.map(({ solicitante, prestamista, finalizador, cantidad, fecha_prestamo, fecha_devolucion, tipo_material, nombre_material }) => ({
        Solicitante: solicitante,
        Prestamista: prestamista,
        Finalizador: finalizador || 'No finalizado',
        Cantidad: cantidad,
        FechaPrestamo: formatoMexico(fecha_prestamo),
        TipoMaterial: tipo_material,
        Nombre: nombre_material || 'Sin nombre',
        Devolucion: fecha_devolucion ? formatoMexico(fecha_devolucion) : 'No devuelto',
      }));

      const hoja = XLSX.utils.json_to_sheet(datosParaExcel);
      XLSX.utils.book_append_sheet(libro, hoja, fecha);
    });

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
    const archivo = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(archivo, 'prestamos_por_fecha.xlsx');
  };

  return (
    <div>
      <h1>Reporte de Préstamos</h1>
      <button onClick={exportarExcelPorFecha} style={{ marginBottom: '20px' }}>
        <FaFileExport style={{ marginRight: '5px' }} />
        Exportar Excel
        </button>

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
              <td>{p.solicitante}</td>
              <td>{p.prestamista}</td>
              <td>{p.finalizador || 'No finalizado'}</td>
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
