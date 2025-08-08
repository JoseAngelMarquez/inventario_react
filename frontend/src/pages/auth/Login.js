import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/usuarioService';

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

      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redireccionar según el rol
      if (data.usuario.rol === 'admin') {
        navigate('/admin');
      } else if (data.usuario.rol === 'prestamista') {
        navigate('/prestamista');
      } else {
        setMensaje('Rol no reconocido');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.mensaje) {
        setMensaje(error.response.data.mensaje);
      } else {
        setMensaje('Error en la conexión con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
      <p>{mensaje}</p>
    </form>
  );
};

export default Login;
