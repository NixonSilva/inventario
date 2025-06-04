// Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const LoginInterno = () => {
const [nit, setNit] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const { loginInterno, internalUser } = useAuth();
const navigate = useNavigate();

useEffect(() => {
if (internalUser) {
navigate("/servicios");
}
}, [internalUser, navigate]);

const handleLogin = (e) => {
e.preventDefault();
// Simulación de login (usuario: user, password: 1234)
if (nit === "user" && password === "1234") {
loginInterno(
{ nombreCliente: "Usuario Demo", perfil: "interno" },
"fake-token",
Date.now() + 3600000
);
navigate("/panel-navemar");
} else {
setError("Usuario o contraseña incorrectos.");
}
};

return (
<div>
<h2>Iniciar Sesión</h2>
<form onSubmit={handleLogin}>
<input
  type="text"
  placeholder="Usuario"
  value={nit}
  onChange={(e) => setNit(e.target.value)}
/>
<input
  type="password"
  placeholder="Contraseña"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
<button type="submit">Entrar</button>
{error && <p style={{ color: "red" }}>{error}</p>}
</form>
</div>
);
};

export default LoginInterno;
