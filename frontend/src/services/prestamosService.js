import axios from "axios";
import Material from "../../../backend/models/materialModel";

const API_URL = "http://localhost:3001/api/prestamos";

export const prestarMaterial = (Material)