import React, { useEffect, useState } from 'react';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/usuarios')
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error('Error al cargar usuarios:', error));
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.usuario} - {usuario.rol}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Usuarios;
