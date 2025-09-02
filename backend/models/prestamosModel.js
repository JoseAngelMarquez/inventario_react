class Prestamos {

  /**
   * Obtiene todos los préstamos con detalles del solicitante y material.
   *
   * @static
   * @param {*} conn
   * @return {*} 
   * @memberof Prestamos
   */
  static async obtenerTodosConDetalles(conn) {
    const [rows] = await conn.query(`
     SELECT 
  p.id,
  p.cantidad,
  p.fecha_prestamo,
  p.fecha_devolucion,
  p.estado,
  s.nombre_completo AS nombre_solicitante,
  s.matricula AS matricula,
  s.numero_empleado AS numero_empleado_solicitante,
  s.tipo AS tipo_solicitante,
  m.nombre AS nombre_material,
  m.tipo AS tipo_material,       -- <--- agregar
  m.descripcion AS descripcion_material,
  u_presto.usuario AS usuario_prestamista,
  u_finalizo.usuario AS usuario_finalizador
FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
      JOIN usuarios u_presto ON p.id_usuario = u_presto.id
      LEFT JOIN usuarios u_finalizo ON p.id_finalizado_por = u_finalizo.id
      ORDER BY p.fecha_prestamo DESC
    `);
    return rows;
  }

  /**
   * Obtiene un préstamo por su ID con detalles del solicitante y material.
   *
   * @static
   * @param {*} conn
   * @param {*} id
   * @return {*} 
   * @memberof Prestamos
   */
  static async obtenerPorId(conn, id) {
    const [rows] = await conn.query(`
      SELECT 
  p.id,
  p.cantidad,
  p.fecha_prestamo,
  p.fecha_devolucion,
  p.estado,
  s.nombre_completo AS nombre_solicitante,
  s.matricula AS matricula,
  s.numero_empleado AS numero_empleado_solicitante,
  s.tipo AS tipo_solicitante,
  m.nombre AS nombre_material,
  m.tipo AS tipo_material,       -- <--- agregar
  m.descripcion AS descripcion_material,
  u.usuario AS usuario_prestamista
FROM prestamos p
    `, [id]);
    return rows[0];
  }

  /**
   *Crea un nuevo préstamo, manejando solicitantes y stock de materiales.
   *
   * @static
   * @param {*} conn
   * @param {*} prestamo
   * @return {*} 
   * @memberof Prestamos
   */
  static async crear(conn, prestamo) {
    const {
      tipo,
      nombre_completo,
      matricula = null,
      carrera = null,
      lugar_trabajo = null,
      telefono = null,
      correo = null,
      numero_empleado = null,
      id_material,
      cantidad,
      fecha_prestamo,
      fecha_devolucion = null,
      id_usuario
    } = prestamo;
  
    await conn.beginTransaction();
  
    try {
      // Determinar qué campos insertar según tipo
      let matriculaInsert = null;
      let carreraInsert = null;
      let numeroEmpleadoInsert = null;
  
      if (tipo === 'estudiante') {
        matriculaInsert = matricula;
        carreraInsert = carrera;
      } else if (tipo === 'empleado') {
        numeroEmpleadoInsert = numero_empleado;
      }
  
      // Verificar si el solicitante ya existe
      let id_solicitante;
      const [existing] = await conn.query(
        tipo === 'empleado'
          ? 'SELECT id, nombre_completo FROM solicitantes WHERE numero_empleado = ?'
          : 'SELECT id, nombre_completo FROM solicitantes WHERE matricula = ?',
        [tipo === 'empleado' ? numero_empleado : matricula]
      );
  
      if (existing.length) {
        // Validar que el nombre coincida
        if (existing[0].nombre_completo !== nombre_completo) {
          throw new Error('La matrícula o número de empleado ya está registrada con otro nombre');
        }
        id_solicitante = existing[0].id;
      } else {
        // Insertar solicitante nuevo
        const [resultSolicitante] = await conn.query(`
          INSERT INTO solicitantes 
            (tipo, nombre_completo, matricula, carrera, lugar_trabajo, telefono, correo, numero_empleado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          tipo,
          nombre_completo,
          matriculaInsert,
          carreraInsert,
          lugar_trabajo,
          telefono,
          correo,
          numeroEmpleadoInsert
        ]);
        id_solicitante = resultSolicitante.insertId;
      }
  
      // Verificar stock y bloquear fila
      const [materialRows] = await conn.query(
        'SELECT cantidad_disponible, nombre FROM materiales WHERE id = ? FOR UPDATE',
        [id_material]
      );
      if (materialRows.length === 0) throw new Error('Material no encontrado');
      if (materialRows[0].cantidad_disponible < cantidad)
        throw new Error('No hay suficiente stock disponible');
  
      // Insertar préstamo
      const [resultPrestamo] = await conn.query(`
        INSERT INTO prestamos (id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario, id_solicitante, estado)
        VALUES (?, ?, ?, ?, ?, ?, 'prestado')
      `, [id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario, id_solicitante]);
  
      // Actualizar stock
      await conn.query(`
        UPDATE materiales
        SET cantidad_disponible = cantidad_disponible - ?
        WHERE id = ?
      `, [cantidad, id_material]);
  
      await conn.commit();
  
      return {
        idPrestamo: resultPrestamo.insertId,
        nombreMaterial: materialRows[0].nombre,
        correoSolicitante: correo,
        nombreSolicitante: nombre_completo,
        numeroEmpleadoSolicitante: numeroEmpleadoInsert,
        matriculaSolicitante: matriculaInsert,
        cantidad
      };
  
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  }
  

  /**
   *  Finaliza un préstamo, actualizando stock si es necesario.
   *
   * @static
   * @param {*} conn
   * @param {*} idPrestamo
   * @param {*} idUsuarioFinaliza
   * @param {boolean} [insumoTerminado=false]
   * @return {*} 
   * @memberof Prestamos
   */
  static async finalizarPrestamo(conn, idPrestamo, idUsuarioFinaliza, insumoTerminado = false) {
    await conn.beginTransaction();
    try {
      const [prestamoRows] = await conn.query(
        'SELECT id_material, cantidad, estado FROM prestamos WHERE id = ? FOR UPDATE',
        [idPrestamo]
      );
      if (prestamoRows.length === 0) throw new Error('Préstamo no encontrado');
      if (prestamoRows[0].estado === 'finalizado')
        throw new Error('El préstamo ya está finalizado');

      // Actualizar estado del préstamo y marcar si el insumo está terminado
      await conn.query(`
      UPDATE prestamos
      SET estado = 'finalizado',
          id_finalizado_por = ?,
          fecha_devolucion = NOW(),
          insumo_terminado = ?
      WHERE id = ?
    `, [idUsuarioFinaliza, insumoTerminado ? 1 : 0, idPrestamo]);

      // Solo devolver al stock si NO se terminó
      if (!insumoTerminado) {
        await conn.query(`
        UPDATE materiales
        SET cantidad_disponible = cantidad_disponible + ?
        WHERE id = ?
      `, [prestamoRows[0].cantidad, prestamoRows[0].id_material]);
      }

      const [prestamoData] = await conn.query(`
     SELECT 
  p.id, 
  p.cantidad,
  p.fecha_prestamo,
  s.nombre_completo AS nombre_solicitante,
  s.matricula,
  s.numero_empleado AS numero_empleado_solicitante,
  s.correo, 
  m.nombre AS nombre_material,
  m.tipo AS tipo_material,
  p.insumo_terminado
FROM prestamos p
JOIN solicitantes s ON p.id_solicitante = s.id
JOIN materiales m ON p.id_material = m.id
WHERE p.id = ?


    `, [idPrestamo]);

      await conn.commit();

      return {
        message: 'Préstamo finalizado correctamente',
        prestamo: prestamoData.length ? prestamoData[0] : null
      };

    } catch (error) {
      await conn.rollback();
      throw error;
    }
  }


  /**
   *obtiene un reporte completo de todos los préstamos con detalles.
   *
   * @static
   * @param {*} conn
   * @return {*} 
   * @memberof Prestamos
   */
  static async obtenerReporteCompleto(conn) {
    const [rows] = await conn.query(`
      SELECT 
        p.id,
        s.nombre_completo AS nombre_solicitante,
        s.matricula AS matricula,
        s.numero_empleado AS numero_empleado_solicitante,
        u_presto.usuario AS prestamista,
        u_finalizo.usuario AS finalizador,
        p.cantidad,
        p.fecha_prestamo,
        p.fecha_devolucion,
        m.tipo AS tipo_material,
        m.nombre AS nombre_material
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN usuarios u_presto ON p.id_usuario = u_presto.id
      LEFT JOIN usuarios u_finalizo ON p.id_finalizado_por = u_finalizo.id
      JOIN materiales m ON p.id_material = m.id
      ORDER BY p.fecha_prestamo DESC
    `);
    return rows;
  }


  /**
   *Filtra préstamos por solicitante, material o fecha.
   *
   * @static
   * @param {*} conn
   * @param {*} { solicitante, material, fecha }
   * @return {*} 
   * @memberof Prestamos
   */
  static async filtrarPrestamos(conn, { solicitante, material, fecha }) {
    let sql = `
      SELECT 
        p.id,
        s.nombre_completo AS nombre_solicitante,
        s.matricula AS matricula,
        s.numero_empleado AS numero_empleado_solicitante,
        s.tipo AS tipo_solicitante,
        m.nombre AS nombre_material,
        p.cantidad,
        p.fecha_prestamo,
        p.estado,
        u_presto.usuario AS usuario_prestamista,
        u_finalizo.usuario AS usuario_finalizador
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
      JOIN usuarios u_presto ON p.id_usuario = u_presto.id
      LEFT JOIN usuarios u_finalizo ON p.id_finalizado_por = u_finalizo.id
      WHERE 1=1
    `;

    const params = [];

    if (solicitante) {
      sql += " AND s.nombre_completo LIKE ?";
      params.push(`%${solicitante}%`);
    }

    if (material) {
      sql += " AND m.nombre LIKE ?";
      params.push(`%${material}%`);
    }

    if (fecha) {
      sql += " AND DATE(p.fecha_prestamo) = ?";
      params.push(fecha);
    }

    const [rows] = await conn.query(sql, params);
    return rows;
  }

  
  /**
   *Filtra préstamos por una fecha específica.
   *
   * @static
   * @param {*} conn
   * @param {*} fecha
   * @return {*} 
   * @memberof Prestamos
   */
  static async filtrarPorFecha(conn, fecha) {
    const [rows] = await conn.query(`
      SELECT 
        p.id,
        s.nombre_completo AS nombre_solicitante,
        s.matricula AS matricula,
        s.numero_empleado AS numero_empleado_solicitante,
        u.usuario AS prestamista,
        u2.usuario AS finalizador,
        p.cantidad,
        p.fecha_prestamo,
        p.fecha_devolucion,
        m.nombre AS nombre_material,
        m.tipo AS tipo_material,
        p.estado
      FROM prestamos p
      LEFT JOIN solicitantes s ON p.id_solicitante = s.id
      LEFT JOIN usuarios u ON p.id_usuario = u.id
      LEFT JOIN usuarios u2 ON p.id_finalizado_por = u2.id
      LEFT JOIN materiales m ON p.id_material = m.id
      WHERE DATE(p.fecha_prestamo) = ?
    `, [fecha]);
    return rows;
  }
}

module.exports = Prestamos;
