const pool = require('../config/db');

class PrestamosModel {
    static async verificarMaterial(id_material) {
        const [rows] = await pool.query(
            'SELECT cantidad_disponible FROM materiales WHERE id = ?',
            [id_material]
        );
        return rows[0];
    }

    static async buscarSolicitante(nombre_completo, tipo) {
        const [rows] = await pool.query(
            'SELECT id FROM solicitantes WHERE nombre_completo = ? AND tipo = ?',
            [nombre_completo, tipo]
        );
        return rows[0];
    }

    static async insertarSolicitante(data) {
        const [result] = await pool.query(
            `INSERT INTO solicitantes 
            (tipo, nombre_completo, matricula, carrera, lugar_trabajo, telefono, correo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.tipo,
                data.nombre_completo,
                data.matricula,
                data.carrera,
                data.lugar_trabajo,
                data.telefono,
                data.correo
            ]
        );
        return result.insertId;
    }

    static async insertarPrestamo(data) {
        await pool.query(
            `INSERT INTO prestamos 
            (id_material, cantidad, fecha_prestamo, estado, id_usuario, id_solicitante) 
            VALUES (?, ?, NOW(), 'prestado', ?, ?)`,
            [data.id_material, data.cantidad, data.id_usuario, data.id_solicitante]
        );
    }

    static async actualizarCantidadMaterial(cantidad, id_material) {
        await pool.query(
            'UPDATE materiales SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?',
            [cantidad, id_material]
        );
    }
}

module.exports = PrestamosModel;
