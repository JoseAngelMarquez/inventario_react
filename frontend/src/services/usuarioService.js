// src/services/usuarioService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/usuarios';

export const login = async (usuario, contrasena) => {
  const response = await axios.post(`${API_URL}/login`, { usuario, contrasena }, {
    withCredentials: true // <<<<<<<<<< importante
  });
  return response.data;
};

export const crearUsuario = async (usuario, contrasena, rol) => {
  const response = await axios.post(`${API_URL}/crear`, { usuario, contrasena, rol }, {
    withCredentials: true
  });
  return response.data;
};

// función para obtener perfil del usuario logueado
export const obtenerUsuarios = async () => {
  const response = await axios.get(`${API_URL}/`, {
    withCredentials: true
  });
  return response.data;
};

export const eliminarUsuario = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true
  });
  return response.data;
};

export const actualizarUsuario = async (id, usuario, contrasena, rol) => {
  const response = await axios.put(`${API_URL}/${id}`, { usuario, contrasena, rol }, {
  });
  return response.data;
}