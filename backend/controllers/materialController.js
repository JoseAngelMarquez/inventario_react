const pool = require('../config/db');
const Material = require('../models/materialModel');

exports.obtenerMateriales = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const materiales = await Material.obtenerTodos(conn);
    res.json(materiales);
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    res.status(500).json({ message: 'Error al obtener materiales' });
  } finally {
    if (conn) conn.release(); 
  }
};

exports.obtenerMaterialPorId = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = req.params.id;
    const material = await Material.obtenerPorId(conn, id);
    if (!material) return res.status(404).json({ message: 'Material no encontrado' });
    res.json(material);
  } catch (error) {
    console.error('Error al obtener material:', error);
    res.status(500).json({ message: 'Error al obtener material' });
  } finally {
    if (conn) conn.release(); 
  }
};

exports.crearMaterial = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const nuevoMaterial = req.body;
    const id = await Material.crear(conn, nuevoMaterial);
    res.status(201).json({ id, message: 'Material creado exitosamente' });
  } catch (error) {
    console.error('Error al crear material:', error);
    res.status(500).json({ message: 'Error al crear material' });
  } finally {
    if (conn) conn.release(); 
  }
};

exports.actualizarMaterial = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = req.params.id;
    const materialActualizado = req.body;
    const affectedRows = await Material.actualizar(conn, id, materialActualizado);
    if (affectedRows === 0) return res.status(404).json({ message: 'Material no encontrado' });
    res.json({ message: 'Material actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar material:', error);
    res.status(500).json({ message: 'Error al actualizar material' });
  } finally {
    if (conn) conn.release(); 
  }
};

exports.eliminarMaterial = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = req.params.id;
    const affectedRows = await Material.eliminar(conn, id);
    if (affectedRows === 0) return res.status(404).json({ message: 'Material no encontrado' });
    res.json({ message: 'Material eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar material:', error);
    res.status(500).json({ message: 'Error al eliminar material' });
  } finally {
    if (conn) conn.release(); 
  }
};

