const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function insertarUsuario() {
  const usuario = 'test';
  const contrasena = '1232';
  const rol = 'prestamista';

  try {
    // Hashear contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Insertar usando tu conexión de config
    const sql = 'INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [usuario, hashedPassword, rol]);

    console.log(`✅ Usuario insertado con ID: ${result.insertId}`);
    console.log(`🔐 Hash: ${hashedPassword}`);
  } catch (error) {
    console.error('❌ Error insertando usuario:', error.message);
  } finally {
    pool.end();
  }
}

insertarUsuario();
