import axios from 'axios';

const API_URL_PRESTAMOS = process.env.REACT_APP_API_URL+'/prestamos';

export const obtenerPrestamos = () => axios.get(API_URL_PRESTAMOS);

export const agregarPrestamo = (prestamo) => axios.post(API_URL_PRESTAMOS, prestamo,{
    withCredentials: true
});

export const finalizarPrestamo = (id, insumoTerminado = false, cantidadDevuelta = null) => 
  axios.put(
    `${API_URL_PRESTAMOS}/${id}/finalizar`, 
    { 
      insumoTerminado,
      cantidadDevuelta
    },  
    { withCredentials: true } 
  );


export const descargarExcelPrestamos = () => axios.get(API_URL_PRESTAMOS + '/exportar/excel', { responseType: 'blob' });

export const obtenerReporteCompleto = () => axios.get(API_URL_PRESTAMOS + '/reporte/completo');

export const filtrarPrestamos = (filtros) => {
  return axios.get(API_URL_PRESTAMOS + '/filtro', {
    params: filtros
  });
};

export const filtrarPrestamosPorFecha = (fecha) => {
  return axios.get(`${API_URL_PRESTAMOS}/filtroFecha`, {
    params: { fecha }
  });
};

