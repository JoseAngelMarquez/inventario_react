import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function PrestamosReporte() {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL +'/prestamos')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener préstamos');
        return res.json();
      })
      .then(data => setPrestamos(data))
      .catch(err => console.error(err));
  }, []);

  const exportarExcel = () => {
    const datosParaExcel = prestamos.map(({ id, nombre_solicitante, nombre_material, fecha_prestamo }) => ({
      ID: id,
      Estudiante: nombre_solicitante,
      Libro: nombre_material,
      Fecha: fecha_prestamo,
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
            <th>Estudiante</th>
            <th>Libro</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre_solicitante}</td>
              <td>{p.nombre_material}</td>
              <td>{p.fecha_prestamo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
