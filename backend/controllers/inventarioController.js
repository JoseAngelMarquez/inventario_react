const Inventario = require("../models/inventarioModel");
const pool = require("../config/db"); 

exports.obtenerTotalesMateriales = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const totales = await Inventario.obtenerTotales(conn);
    res.json(totales);
  } catch (err) {
    //console.error("Error obteniendo totales:", err);
    res.status(500).json({ error: "Error en el servidor" }); // En caso de error, responder con estado 500
  } finally {
    if (conn) conn.release(); 
  }
};
