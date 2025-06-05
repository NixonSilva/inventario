import React, { createContext, useContext, useState, useEffect } from "react";

// Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [internalUser, setInternalUser] = useState(null);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("internalUser");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (storedUser && tokenExpiration && new Date(tokenExpiration) > new Date()) {
      setInternalUser(JSON.parse(storedUser));
    } else {
      // Limpia si el token expiró
      logoutInterno();
    }
  }, []);

  // Función para iniciar sesión
  const loginInterno = (userData, token, expiration) => {
    setInternalUser(userData);
    localStorage.setItem("internalUser", JSON.stringify(userData));
    localStorage.setItem("authToken", token);
    localStorage.setItem("tokenExpiration", expiration);
  };

  // Función para cerrar sesión
  const logoutInterno = () => {
    setInternalUser(null);
    localStorage.removeItem("internalUser");
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiration");
  };

  return (
    <AuthContext.Provider value={{ internalUser, loginInterno, logoutInterno }}>
      {children}
    </AuthContext.Provider>
  );
};
