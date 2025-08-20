import React, { useEffect, useState } from "react";
import { crearUsuario, obtenerUsuarios, eliminarUsuario } from "../../services/usuarioService";
import "../../styles/Usuarios.css";

const Inicio = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("prestamista");
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  // Paginación
  const [pagina, setPagina] = useState(1);
  const filasPorPagina = 5;
  const totalPaginas = Math.ceil(usuarios.length / filasPorPagina);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const lista = await obtenerUsuarios();
        setUsuarios(lista);
        console.log("Usuarios obtenidos:", lista);
      } catch (error) {
        setError("Error al obtener usuarios");
      }
    };
    fetchUsuarios();
  }, []);

  const handleCrearUsuario = async () => {
    setError(null);
    setMensaje(null);

    if (!usuario || !contrasena) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }

    try {
      const data = await crearUsuario(usuario, contrasena, rol);
      setMensaje(`Usuario creado con ID: ${data.id}`);
      setUsuario("");
      setContrasena("");

      // Refrescar la lista de usuarios
      const lista = await obtenerUsuarios();
      setUsuarios(lista);
      setPagina(1); // Opcional: volver a la primera página
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error creando usuario");
    }
  };
  const handleDeleteUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
    } catch (error) {
      alert("Error al eliminar usuario: " + error.message);
    }
  }

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1) nuevaPagina = 1;
    if (nuevaPagina > totalPaginas) nuevaPagina = totalPaginas;
    setPagina(nuevaPagina);
  };

  // Filas que se mostrarán en la página actual
  const filasMostradas = usuarios.slice(
    (pagina - 1) * filasPorPagina,
    pagina * filasPorPagina
  );

  return (
    <div>
      <h2>Crear usuario</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        className="input2"
      />
      <div>
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="prestamista">Prestamista</option>
        <option value="admin">Admin</option>
        
      </select>
      <button className="btn-crear" onClick={handleCrearUsuario}>Crear Usuario</button>

      </div>
      
      
      

      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
               <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filasMostradas.map((user) => (
            <tr key={user.id}>
              <td>{user.usuario}</td>
              <td>{user.rol}</td>
              <td>
                <button
                onClick={() => handleDeleteUsuario(user.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => cambiarPagina(pagina - 1)} disabled={pagina === 1}>
          Anterior
        </button>
        <span style={{ margin: "0 10px" }}>
          Página {pagina} de {totalPaginas}
        </span>
        <button onClick={() => cambiarPagina(pagina + 1)} disabled={pagina === totalPaginas}>
          Siguiente
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
};

export default Inicio;
