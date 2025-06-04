// AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [internalUser, setInternalUser] = useState(null);

  const loginInterno = (userData, token, expiration) => {
    setInternalUser(userData);
    // Aquí podrías guardar token en localStorage si lo necesitas
  };

  const logoutInterno = () => {
    setInternalUser(null);
  };

  return (
    <AuthContext.Provider value={{ internalUser, loginInterno, logoutInterno }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
