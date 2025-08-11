import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { obtenerReporteCompleto } from "../../services/prestamosService";  // solo esta que usas

export default function PrestamosReporte() {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    obtenerReporteCompleto()
      .then(res => setPrestamos(res.data))
      .catch(err => console.error(err));
  }, []);

  const exportarExcel = () => {
    const datosParaExcel = prestamos.map(({ id, solicitante, prestamista, finalizador, cantidad, fecha_prestamo, tipo_material, nombre_material }) => ({
      ID: id,
      Solicitante: solicitante,
      Prestamista: prestamista,
      Finalizador: finalizador || 'No finalizado',
      Cantidad: cantidad,
      FechaPrestamo: fecha_prestamo,
      TipoMaterial: tipo_material,
      Nombre : nombre_material || 'Sin nombre',
    }));

    const hoja = XLSX.utils.json_to_sheet(datosParaExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Préstamos");

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
    const archivo = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(archivo, 'prestamos.xlsx');
  };

  return (
    <div>
      <h1>Reporte de Préstamos</h1>
      <button onClick={exportarExcel}>Exportar a Excel</button>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solicitante</th>
            <th>Prestamista</th>
            <th>Finalizador</th>
            <th>Cantidad</th>
            <th>Fecha Préstamo</th>
            <th>Tipo Material</th>
            <th>Nombre Material</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.solicitante}</td>
              <td>{p.prestamista}</td>
              <td>{p.finalizador || 'No finalizado'}</td>
              <td>{p.cantidad}</td>
              <td>
                {new Date(p.fecha_prestamo).toLocaleString("es-MX", {
                  timeZone: "America/Mexico_City",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </td>
              <td>{p.tipo_material}</td>
              <td>{p.nombre_material}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
