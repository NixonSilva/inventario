import React, { useState } from "react";
import axios from "axios";
import "../styles/AuthForm.css"; // Cambiado a RegisterForm.css

const Registrarse = () => {
  const [formData, setFormData] = useState({
    email: "",
    nombre_completo: "",
    clave: "",
    estado: "ACTIVO",
    usuario_creacion: "sistema", // puedes cambiar esto dinámicamente
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://inventario.navesoft.com/backend/RegisterLogin.php", formData);
      if (response.data.success) {
        setMensaje("Usuario registrado con éxito");
      } else {
        setMensaje("Error: " + response.data.message);
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegistro}>
        <h2>Registrarse</h2>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombre_completo"
          placeholder="Nombre completo"
          value={formData.nombre_completo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="clave"
          placeholder="Contraseña"
          value={formData.clave}
          onChange={handleChange}
          required
        />
        <button type="submit">Crear Cuenta</button>
        {mensaje && <p className="register-mensaje">{mensaje}</p>}
        <p>
          ¿Ya tiene cuenta? <a href="/">Iniciar Sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Registrarse;