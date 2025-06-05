// PanelNavemarPage.jsx
import React from "react";
import { useAuth } from "../AuthContext";

const PanelNavemarPage = () => {
  const { internalUser, logoutInterno } = useAuth();

  return (
    <div>
      <h1>Bienvenido, {internalUser?.nombreCliente}</h1>
      <button onClick={logoutInterno}>Cerrar sesión</button>
    </div>
  );
};

export default PanelNavemarPage;