import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/usuarioService';
import styles from '../../styles/login.module.css';
import uaeh from '../../images/uaeh.png';
import { FaUserCircle, FaLock } from "react-icons/fa";
import logo_login from '../../images/logo_login.png'; // Asegúrate de tener esta imagen en la ruta correcta
const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);
    try {
      const data = await login(usuario, contrasena);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      if (data.usuario.rol === 'admin') navigate('/admin');
      else if (data.usuario.rol === 'prestamista') navigate('/prestamista');
      else setMensaje('Rol no reconocido');
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || 'Error en la conexión con el servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={uaeh} alt="UAEMex" className={styles.logo} />
      </div>
      <div className={styles.right}>
        <form className={styles.formulario} onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>

          <div>
            <img src={logo_login} alt="Logo" className={styles.logoLogin} />
          </div>
          <div className={styles.inputGroup}>
            <FaUserCircle className={styles.icon} />
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
