// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUserData = localStorage.getItem("user");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  const login = (userData) => {
    setUser(userData);
  };

  const navigate = useNavigate();
  const logout = useCallback(() => {
    setUser(null);
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user");
    navigate("/LoginInterno");
  }, [setUser, navigate]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
