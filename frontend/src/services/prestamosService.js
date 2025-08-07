import axios from 'axios';

const API_URL = 'http://localhost:3001/api/prestamos';

export const obtenerPrestamos = () => axios.get(API_URL);

export const agregarPrestamo = (prestamo) => axios.post(API_URL, prestamo);

export const finalizarPrestamo = (id) => axios.delete(`${API_URL}/${id}`);
