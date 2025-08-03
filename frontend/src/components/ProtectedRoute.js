// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, rolPermitido }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/" />;
  }

  if (rolPermitido && usuario.rol !== rolPermitido) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
