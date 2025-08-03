// src/services/materialService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/materiales';

export const obtenerMateriales = () => axios.get(API_URL);

export const agregarMaterial = (material) => axios.post(API_URL, material);

export const actualizarMaterial = (id, material) => axios.put(`${API_URL}/${id}`, material);

export const eliminarMaterial = (id) => axios.delete(`${API_URL}/${id}`);
