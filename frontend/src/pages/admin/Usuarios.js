// src/pages/Usuarios/Inicio.jsx
import React, { useEffect, useState } from "react";
import { crearUsuario, actualizarUsuario, eliminarUsuario, obtenerPaginados } from "../../services/usuarioService";
import UsuarioList from "../../components/UsuarioList";
import "../../styles/Usuarios.css";
import { TiUserAdd } from "react-icons/ti";
import { FaTimes } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";

const Inicio = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("prestamista");
  const [mensaje, setMensaje] = useState(null);

  // Paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const filasPorPagina = 5;

  useEffect(() => {
    fetchUsuarios(pagina);
  }, [pagina]);

  const fetchUsuarios = async (paginaActual = 1) => {
    try {
      const data = await obtenerPaginados(paginaActual, filasPorPagina);
      setUsuarios(data.usuarios);
      setTotalPaginas(Math.ceil(data.total / filasPorPagina));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!usuario || !contrasena) {
      setMensaje("Usuario y contraseña son obligatorios");
      return;
    }

    try {
      if (usuarioSeleccionado && usuarioSeleccionado.id) {
        console.log("Actualizando usuario ID:", usuarioSeleccionado.id);
        await actualizarUsuario(usuarioSeleccionado.id, usuario, contrasena, rol);
        setMensaje("Usuario actualizado correctamente");
      } else {
        const data = await crearUsuario(usuario, contrasena, rol);
        setMensaje(`Usuario creado con ID: ${data.id}`);
      }
      setUsuario("");
      setContrasena("");
      setRol("prestamista");
      setUsuarioSeleccionado(null);
      fetchUsuarios(pagina);
    } catch (err) {
      setMensaje("Error al procesar usuario: " + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleEditar = (user) => {
    setUsuarioSeleccionado(user);
    setUsuario(user.usuario);
    setRol(user.rol);
    setContrasena("");
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      fetchUsuarios(pagina);
    } catch (err) {
      alert("No se puede eliminar el usuario porque tiene registros asociados: " + err.message);
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1) nuevaPagina = 1;
    if (nuevaPagina > totalPaginas) nuevaPagina = totalPaginas;
    setPagina(nuevaPagina);
  };

  return (
    <div>
      <h2>{usuarioSeleccionado ? "Editar usuario" : "Crear usuario"}</h2>
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
      />
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="prestamista">Prestamista</option>
        <option value="admin">Admin</option>
      </select>
      <button
        onClick={handleSubmit}
        style={{ display: "flex", alignItems: "center", gap: "5px" }}
      >
        {usuarioSeleccionado ? <GrUpdate /> : <TiUserAdd />}
        {usuarioSeleccionado ? "Actualizar" : "Crear"}
      </button>


      {/* Botón Cancelar */}
      {usuarioSeleccionado && (
        <button
          onClick={() => {
            setUsuarioSeleccionado(null);
            setUsuario("");
            setContrasena("");
            setRol("prestamista");
          }}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          {/* Aquí puedes usar otro icono */}
          <FaTimes />
          Cancelar
        </button>
      )}

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      <UsuarioList
        usuarios={usuarios.map(u => ({ usuario: u.usuario, rol: u.rol, id: u.id }))}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />

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
    </div>
  );
};

export default Inicio;
