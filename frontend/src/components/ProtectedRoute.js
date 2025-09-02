import { Navigate } from "react-router-dom";

/**
 *Componente para proteger rutas evitando el ingreso sin la sesión
 *
 * @param {*} { children, rolPermitido }
 * @return {*} 
 */

const ProtectedRoute = ({ children, rolPermitido }) => {

  // Obtenemos el usuario guardado en localStorage (si existe)
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  
  // Si no hay usuario en localStorage, redirige al inicio ("/")
  if (!usuario) {
    return <Navigate to="/" />;
  }

  // Verificamos si el rol del usuario está permitido:
  //  - Si rolPermitido es un arreglo → comprobamos si incluye el rol del usuario
  //  - Si rolPermitido es un valor único → comparamos directamente
  const permitido = Array.isArray(rolPermitido)
    ? rolPermitido.includes(usuario.rol)
    : usuario.rol === rolPermitido;

  // Si el rol del usuario no está permitido, lo mandamos al inicio

  if (!permitido) {
    return <Navigate to="/" />;
  }
  // Si pasa las validaciones, renderizamos el contenido protegido

  return children;
};

export default ProtectedRoute;
