// src/services/usuarioService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL+'usuarios';

export const login = async (usuario, contrasena) => {
  const response = await axios.post(`${API_URL}/login`, { usuario, contrasena });
  return response.data;
};


export const crearUsuario = async (usuario, contrasena, rol) => {
  const response = await axios.post(`${API_URL}/crear`, { usuario, contrasena, rol });
  return response.data;
};

