const db = require("../config/db");

class Material {
  static async obtenerTodos() {
    const [rows] = await db.query("SELECT * FROM materiales");
    return rows;
  }

  static async crear({ nombre, tipo, cantidad_disponible, descripcion }) {
    await db.query(
      "INSERT INTO materiales (nombre, tipo, cantidad_disponible, descripcion) VALUES (?, ?, ?, ?)",
      [nombre, tipo, cantidad_disponible, descripcion]
    );
  }

  static async actualizar(id, { nombre, tipo, cantidad_disponible, descripcion }) {
    await db.query(
      "UPDATE materiales SET nombre = ?, tipo = ?, cantidad_disponible = ?, descripcion = ? WHERE id = ?",
      [nombre, tipo, cantidad_disponible, descripcion, id]
    );
  }

  static async eliminar(id) {
    await db.query("DELETE FROM materiales WHERE id = ?", [id]);
  }
}

module.exports = Material;
