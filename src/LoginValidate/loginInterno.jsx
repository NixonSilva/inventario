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

    if (!email || !clave) {
      setError("Por favor, complete todos los campos.");
      return;
    }

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
          nombre: usuario.nombre_completo,
          email: usuario.email,
          nombre_tipo: usuario.nombre_tipo,
          permite_modificar: usuario.permite_modificar,
          permite_desactivar: usuario.permite_desactivar,
          permite_insertar: usuario.permite_insertar,
        });
        navigate("/");
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. Intente más tarde.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>

        {/* Mensaje de error directo */}
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

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
          <Link to="/RegistroLogin"> Regístrese</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginInterno;
