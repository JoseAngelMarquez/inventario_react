import axios from "axios";

const API_URL = "http://localhost:3001/api/prestamos";

const obtenerPrestamos = () => axios.get(API_URL);