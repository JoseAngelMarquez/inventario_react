import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, rolPermitido }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/" />;
  }

  const permitido = Array.isArray(rolPermitido)
    ? rolPermitido.includes(usuario.rol)
    : usuario.rol === rolPermitido;

  if (!permitido) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
