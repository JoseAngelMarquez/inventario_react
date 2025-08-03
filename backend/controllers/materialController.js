const Material = require("../models/Material");

exports.obtenerMateriales = async (req, res) => {
  try {
    const materiales = await Material.obtenerTodos();
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener materiales", error: error.message });
  }
};

exports.crearMaterial = async (req, res) => {
  try {
    await Material.crear(req.body);
    res.json({ mensaje: "Material creado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear material", error: error.message });
  }
};

exports.actualizarMaterial = async (req, res) => {
  try {
    await Material.actualizar(req.params.id, req.body);
    res.json({ mensaje: "Material actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar material", error: error.message });
  }
};

exports.eliminarMaterial = async (req, res) => {
  try {
    await Material.eliminar(req.params.id);
    res.json({ mensaje: "Material eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar material", error: error.message });
  }
};
