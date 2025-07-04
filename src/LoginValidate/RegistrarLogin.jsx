import React, { useState } from "react";
import axios from "axios";
import "../styles/AuthForm.css"; // Usamos los mismos estilos

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
      const response = await axios.post("hhttp://172.20.158.193/inventario_navesoft/backend/RegisterLogin.php", formData);
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
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegistro}>
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
        {mensaje && <p className="mensaje">{mensaje}</p>}
        <p>
          ¿Ya tiene cuenta? <a href="/">Iniciar Sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Registrarse;
