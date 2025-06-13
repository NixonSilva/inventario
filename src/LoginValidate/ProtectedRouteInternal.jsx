// src/ProtectedRouteInternal.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AutoContext";

const ProtectedRouteInternal = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirige al login y guarda la ruta original
    return <Navigate to="/login-navemar" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRouteInternal;
