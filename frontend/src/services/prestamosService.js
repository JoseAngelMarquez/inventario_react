import axios from 'axios';

const API_URL_PRESTAMOS = 'http://localhost:3001/api/prestamos';
export const obtenerPrestamos = () => axios.get(API_URL_PRESTAMOS);

export const agregarPrestamo = (prestamo) => axios.post(API_URL_PRESTAMOS, prestamo);

export const finalizarPrestamo = (id) => axios.put(`${API_URL_PRESTAMOS}/${id}/finalizar`);

