import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/usuarios';

// Login de usuario
export const login = async (usuario, contrasena) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { usuario, contrasena },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    //console.error('Error en login:', error);
    throw error;
  }
};

// Crear un nuevo usuario
export const crearUsuario = async (usuario, contrasena, rol) => {
  try {
    const response = await axios.post(
      `${API_URL}/crear`,
      { usuario, contrasena, rol },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    //console.error('Error al crear usuario:', error);
    throw error;
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/`, { withCredentials: true });
    return response.data;
  } catch (error) {
    //console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Eliminar un usuario por id
export const eliminarUsuario = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    //console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

// Actualizar un usuario por id
export const actualizarUsuario = async (id, usuario, contrasena, rol) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      { usuario, contrasena, rol },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    //console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Obtener usuarios paginados
export const obtenerPaginados = async (pagina = 1, filasPorPagina = 10) => {
  try {
    const response = await axios.get(`${API_URL}/paginado`, {
      params: { pagina, limite: filasPorPagina },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    //console.error('Error al obtener usuarios paginados:', error);
    throw error;
  }
};
