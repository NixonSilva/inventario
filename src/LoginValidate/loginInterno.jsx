import React, { useState, useEffect } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AutoContext";
import "../styles/LoginInterno.css";

const LoginInterno = () => {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://172.20.158.193/inventario_navesoft/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, clave }),
      });

      const data = await response.json();

      if (data.respuesta === "Consulta exitosa" && data.Consulta?.length > 0) {
        const usuario = data.Consulta[0];
        login({
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre_completo,
          email: usuario.email,
        });
        navigate("/"); // Redirección a la página principal protegida
      } else {
        setError(data.respuesta || "Credenciales inválidas");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div class="login-wrapper">
      <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      <div className="extra-links">
        <Link to="/olvide-clave">¿Olvidó su contraseña?</Link>
        <br />
        <span>¿No tiene cuenta?</span>
        <Link to="/registrese-navemar">Regístrese</Link>
      </div>
    </div>
    </div>
  );
};

export default LoginInterno;
