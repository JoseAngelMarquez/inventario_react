// src/services/usuarioService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/usuarios';

export const login = async (usuario, contrasena) => {
  const response = await axios.post(`${API_URL}/login`, { usuario, contrasena });
  return response.data;
};
