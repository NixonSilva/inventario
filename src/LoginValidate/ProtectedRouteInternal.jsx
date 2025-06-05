// ProtectedRouteInternal.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AutoContext";

const ProtectedRouteInternal = () => {
  const { internalUser } = useAuth();

  return internalUser ? <Outlet /> : <Navigate to="/login-navemar" replace />;
};

export default ProtectedRouteInternal;