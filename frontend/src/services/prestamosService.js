import axios from 'axios';

const API_URL_PRESTAMOS = 'http://localhost:3001/api/prestamos';
const API_URL_MATERIALES = 'http://localhost:3001/api/materiales';

export const obtenerPrestamos = () => axios.get(API_URL_PRESTAMOS);

export const agregarPrestamo = (prestamo) => axios.post(API_URL_PRESTAMOS, prestamo);

export const finalizarPrestamo = (id) => axios.delete(`${API_URL_PRESTAMOS}/${id}`);

export const obtenerMateriales = () => axios.get(API_URL_MATERIALES);
