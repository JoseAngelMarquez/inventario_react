class Prestamos {
  static async obtenerTodosConDetalles(conn) {
    const [rows] = await conn.query(`
      SELECT 
        p.id,
        p.cantidad,
        p.fecha_prestamo,
        p.fecha_devolucion,
        p.estado,
        s.nombre_completo AS nombre_solicitante,
        s.tipo AS tipo_solicitante,
        m.nombre AS nombre_material,
        m.descripcion AS descripcion_material,
        u.usuario AS usuario_prestamista
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
      JOIN usuarios u ON p.id_usuario = u.id
      ORDER BY p.fecha_prestamo DESC
    `);
    return rows;
  }

  static async obtenerPorId(conn, id) {
    const [rows] = await conn.query(`
      SELECT 
        p.id,
        p.cantidad,
        p.fecha_prestamo,
        p.fecha_devolucion,
        p.estado,
        s.nombre_completo AS nombre_solicitante,
        s.tipo AS tipo_solicitante,
        m.nombre AS nombre_material,
        m.descripcion AS descripcion_material,
        u.usuario AS usuario_prestamista
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
      JOIN usuarios u ON p.id_usuario = u.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async crear(conn, prestamo) {
    const { id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion = null, id_usuario } = prestamo;

    if (!id_usuario) throw new Error("El campo 'id_usuario' es obligatorio");
    if (!id_solicitante) throw new Error("El campo 'id_solicitante' es obligatorio");
    if (!id_material) throw new Error("El campo 'id_material' es obligatorio");
    if (!cantidad || cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");
    if (!fecha_prestamo) throw new Error("El campo 'fecha_prestamo' es obligatorio");

    // Insertar préstamo
    const [result] = await conn.query(`
      INSERT INTO prestamos (id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario]);

    // Actualizar cantidad disponible del material
    await conn.query(`
      UPDATE materiales SET cantidad_disponible = cantidad_disponible - ?
      WHERE id = ?
    `, [cantidad, id_material]);

    return result.insertId;
  }

  static async actualizar(conn, id, prestamo) {
    const { id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion, estado, id_usuario } = prestamo;

    // Actualiza todos los campos necesarios, incluidos id_usuario y estado
    const [result] = await conn.query(`
      UPDATE prestamos
      SET id_solicitante = ?, id_material = ?, cantidad = ?, fecha_prestamo = ?, fecha_devolucion = ?, estado = ?, id_usuario = ?
      WHERE id = ?
    `, [id_solicitante, id_material, cantidad, fecha_prestamo, fecha_devolucion, estado, id_usuario, id]);

    return result.affectedRows;
  }

  static async eliminar(conn, id) {
    // Obtener info del préstamo antes de eliminar para devolver cantidad
    const [rows] = await conn.query(`SELECT id_material, cantidad FROM prestamos WHERE id = ?`, [id]);
    const prestamo = rows[0];
    if (!prestamo) return false;

    // Eliminar préstamo
    await conn.query(`DELETE FROM prestamos WHERE id = ?`, [id]);

    // Devolver cantidad al inventario
    await conn.query(`
      UPDATE materiales SET cantidad_disponible = cantidad_disponible + ?
      WHERE id = ?
    `, [prestamo.cantidad, prestamo.id_material]);

    return true;
  }
}

module.exports = Prestamos;
