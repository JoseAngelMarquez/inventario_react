import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + '/inventario/materiales';

export const obtenerTotales = () => axios.get(API_URL);
