class Prestamos {
  /**
   * Helper: consulta base con joins y campos comunes.
   */
  static getBaseQuery() {
    return `
      SELECT 
        p.id,
        p.cantidad,
        p.fecha_prestamo,
        p.fecha_devolucion,
        p.estado,
        p.insumo_terminado,
        s.nombre_completo AS nombre_solicitante,
        s.matricula AS matricula,
        s.numero_empleado AS numero_empleado_solicitante,
        s.tipo AS tipo_solicitante,
        m.nombre AS nombre_material,
        m.tipo AS tipo_material,
        m.descripcion AS descripcion_material,
        u_presto.usuario AS usuario_prestamista,
        u_finalizo.usuario AS usuario_finalizador
      FROM prestamos p
      JOIN solicitantes s ON p.id_solicitante = s.id
      JOIN materiales m ON p.id_material = m.id
      JOIN usuarios u_presto ON p.id_usuario = u_presto.id
      LEFT JOIN usuarios u_finalizo ON p.id_finalizado_por = u_finalizo.id
    `;
  }

  /**
   * Obtiene todos los préstamos con detalles del solicitante y material.
   */
  static async obtenerTodosConDetalles(conn) {
    const [rows] = await conn.query(this.getBaseQuery() + " ORDER BY p.fecha_prestamo DESC");
    return rows;
  }

  /**
   * Obtiene un préstamo por su ID con detalles del solicitante y material.
   */
  static async obtenerPorId(conn, id) {
    const [rows] = await conn.query(this.getBaseQuery() + " WHERE p.id = ?", [id]);
    return rows[0] || null;
  }

  /**
   * Crea un nuevo préstamo, manejando solicitantes y stock de materiales.
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

    // Normaliza nombres para comparar (quita acentos y convierte a minúsculas)
    function normalizarTexto(texto) {
      return texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    }

    await conn.beginTransaction();

    try {
      // Determinar qué campos insertar según tipo
      let matriculaInsert = null;
      let carreraInsert = null;
      let numeroEmpleadoInsert = null;

      if (tipo === "estudiante") {
        matriculaInsert = matricula;
        carreraInsert = carrera;
      } else if (tipo === "empleado") {
        numeroEmpleadoInsert = numero_empleado;
      }

      // Verificar si el solicitante ya existe (por matrícula o número de empleado)
      let id_solicitante;
      const [existing] = await conn.query(
        tipo === "empleado"
          ? "SELECT id, nombre_completo FROM solicitantes WHERE numero_empleado = ?"
          : "SELECT id, nombre_completo FROM solicitantes WHERE matricula = ?",
        [tipo === "empleado" ? numero_empleado : matricula]
      );

      if (existing.length) {
        // Comparación insensible a acentos y mayúsculas
        const nombreExistente = normalizarTexto(existing[0].nombre_completo);
        const nombreNuevo = normalizarTexto(nombre_completo);

        if (nombreExistente !== nombreNuevo) {
          throw new Error("La matrícula o número de empleado ya está registrada con otro nombre");
        }
        id_solicitante = existing[0].id;
      } else {
        // Insertar solicitante nuevo
        const [resultSolicitante] = await conn.query(
          `
          INSERT INTO solicitantes 
            (tipo, nombre_completo, matricula, carrera, lugar_trabajo, telefono, correo, numero_empleado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            tipo,
            nombre_completo,
            matriculaInsert,
            carreraInsert,
            lugar_trabajo,
            telefono,
            correo,
            numeroEmpleadoInsert
          ]
        );
        id_solicitante = resultSolicitante.insertId;
      }

      // Verificar stock y bloquear fila
      const [materialRows] = await conn.query(
        "SELECT cantidad_disponible, nombre FROM materiales WHERE id = ? FOR UPDATE",
        [id_material]
      );
      if (materialRows.length === 0) throw new Error("Material no encontrado");
      if (materialRows[0].cantidad_disponible < cantidad)
        throw new Error("No hay suficiente stock disponible");

      // Insertar préstamo
      const [resultPrestamo] = await conn.query(
        `
        INSERT INTO prestamos (id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario, id_solicitante, estado)
        VALUES (?, ?, ?, ?, ?, ?, 'prestado')
      `,
        [id_material, cantidad, fecha_prestamo, fecha_devolucion, id_usuario, id_solicitante]
      );

      // Actualizar stock
      await conn.query(
        `
        UPDATE materiales
        SET cantidad_disponible = cantidad_disponible - ?
        WHERE id = ?
      `,
        [cantidad, id_material]
      );

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
   * Finaliza un préstamo, actualizando stock si es necesario.
   *
   * @param {*} conn
   * @param {*} idPrestamo
   * @param {*} idUsuarioFinaliza
   * @param {boolean} [insumoTerminado=false]
   * @param {number|null} [cantidadDevuelta=null]
   */
  static async finalizarPrestamo(conn, idPrestamo, idUsuarioFinaliza, insumoTerminado = false, cantidadDevuelta = null) {
    await conn.beginTransaction();
    try {
      const [prestamoRows] = await conn.query(
        `SELECT 
           p.id AS id_prestamo,
           p.id_material,
           p.cantidad,
           p.estado,
           p.insumo_terminado,
           m.tipo AS tipo_material
         FROM prestamos p
         JOIN materiales m ON p.id_material = m.id
         WHERE p.id = ? FOR UPDATE`,
        [idPrestamo]
      );
  
      if (prestamoRows.length === 0) throw new Error("Préstamo no encontrado");
      if (prestamoRows[0].estado === "finalizado") throw new Error("El préstamo ya está finalizado");
  
      const prestamo = prestamoRows[0];
  
      // Actualizar estado del préstamo y marcar si el insumo está terminado
      await conn.query(
        `
        UPDATE prestamos
        SET estado = 'finalizado',
            id_finalizado_por = ?,
            fecha_devolucion = NOW(),
            insumo_terminado = ?
        WHERE id = ?
        `,
        [idUsuarioFinaliza, insumoTerminado ? 1 : 0, idPrestamo]
      );
  
      // Devolver al stock solo si NO se terminó
      // Devolver al stock solo si NO se terminó
      if (!insumoTerminado) {
        // Convertir cantidadDevuelta a número
        const cantidadNum = Number(cantidadDevuelta);
        
        // Si no es número o es negativo, usar 0; si es válido, usarlo
        const devolver = (!isNaN(cantidadNum) && cantidadNum >= 0) ? cantidadNum : 0;
      
        await conn.query(
          `
          UPDATE materiales
          SET cantidad_disponible = cantidad_disponible + ?
          WHERE id = ?
          `,
          [devolver, prestamo.id_material]
        );
      }
      
    
      

  
      // Obtener datos actualizados para respuesta
      const [prestamoData] = await conn.query(this.getBaseQuery() + " WHERE p.id = ?", [idPrestamo]);
  
      await conn.commit();
  
      return {
        message: "Préstamo finalizado correctamente",
        prestamo: prestamoData.length ? prestamoData[0] : null
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  }
  

  /**
   * Obtiene un reporte completo de todos los préstamos con detalles.
   */
  static async obtenerReporteCompleto(conn) {
    const [rows] = await conn.query(this.getBaseQuery() + " ORDER BY p.fecha_prestamo DESC");
    return rows;
  }

  /**
   * Filtra préstamos por solicitante, material o fecha.
   */
  static async filtrarPrestamos(conn, { solicitante, material, fecha }) {
    let sql = this.getBaseQuery() + " WHERE 1=1";
    const params = [];

    if (solicitante && solicitante.trim() !== "") {
      sql += " AND s.nombre_completo LIKE ?";
      params.push(`%${solicitante}%`);
    }

    if (material && material.trim() !== "") {
      sql += " AND m.nombre LIKE ?";
      params.push(`%${material}%`);
    }

    if (fecha && fecha.trim() !== "") {
      sql += " AND DATE(p.fecha_prestamo) = ?";
      params.push(fecha);
    }

    const [rows] = await conn.query(sql, params);
    return rows;
  }

  /**
   * Filtra préstamos por una fecha específica.
   */
  static async filtrarPorFecha(conn, fecha) {
    const [rows] = await conn.query(this.getBaseQuery() + " WHERE DATE(p.fecha_prestamo) = ?", [fecha]);
    return rows;
  }
}

module.exports = Prestamos;
