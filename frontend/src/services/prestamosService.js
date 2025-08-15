import axios from 'axios';

const API_URL_PRESTAMOS = process.env.REACT_APP_API_URL+'/prestamos';

export const obtenerPrestamos = () => axios.get(API_URL_PRESTAMOS);

export const agregarPrestamo = (prestamo) => axios.post(API_URL_PRESTAMOS, prestamo);

export const finalizarPrestamo = (id) => axios.put(`http://localhost:3001/api/prestamos/${id}/finalizar`, {}, {
    withCredentials: true
  });
  

export const descargarExcelPrestamos = () => axios.get(API_URL_PRESTAMOS + '/exportar/excel', { responseType: 'blob' });

export const obtenerReporteCompleto = () => axios.get(API_URL_PRESTAMOS + '/reporte/completo');