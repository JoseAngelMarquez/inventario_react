const bcrypt = require('bcrypt');
const pool = require('../config/db');



/**
 *Scrip para insertar usuario directamente
 *
 */

async function insertarUsuario() {
  const usuario = 'admin_';
  const contrasena = '123';
  const rol = 'admin';

  try {
    // Hashear contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    const sql = 'INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [usuario, hashedPassword, rol]);

    //console.log(`Usuario insertado con ID: ${result.insertId}`);
    //console.log(`Hash: ${hashedPassword}`);
  } catch (error) {
    //console.error('Error insertando usuario:', error.message);
  } finally {
    pool.end();
  }
}

insertarUsuario();
