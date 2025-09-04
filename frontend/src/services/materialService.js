// src/services/materialService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL+'/materiales';

export const obtenerMateriales = () => axios.get(API_URL);

export const agregarMaterial = (material) => axios.post(API_URL, material);

export const actualizarMaterial = (id, material) => axios.put(`${API_URL}/${id}`, material);

export const eliminarMaterial = (id) => axios.delete(`${API_URL}/${id}`);

export const filtrarMaterialPorNombre = (nombre) => 
    axios.get(`${API_URL}/filtro`, {
      params: { nombre } 
    });

    export const descargarExcelMateriales = () => axios.get(API_URL + '/exportar-excel', { responseType: 'blob' });
  