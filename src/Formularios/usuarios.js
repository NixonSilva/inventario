import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/styles_F2.css";

const NuevoUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    empresa: "",
    unidad_negocio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistrar = async () => {
    try {
      await axios.post("http://localhost:3000/api/usuarios", formData); // <-- Cambia la URL si tu backend tiene otro puerto o ruta
      alert("Usuario registrado correctamente");
      navigate("/usuarios"); // Redirige a la vista de usuarios
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Registro de Usuario</h2>
      <div className="form-grid-simplificado">
        <label>
          Nombre
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </label>
        <label>
          Ubicación
          <input
            type="text"
            name="ubicacion"
            placeholder="Ubicación"
            value={formData.ubicacion}
            onChange={handleChange}
          />
        </label>
        <label>
          Empresa
          <input
            type="text"
            name="empresa"
            placeholder="Empresa"
            value={formData.empresa}
            onChange={handleChange}
          />
        </label>
        <label>
          Unidad de Negocio
          <input
            type="text"
            name="unidad_negocio"
            placeholder="Unidad de Negocio"
            value={formData.unidad_negocio}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="form-botones">
      <button className="btn-estilo" onClick={() => navigate("/usuarios")}>Registros</button>
        <button className="btn-estilo" onClick={handleRegistrar}>Guardar</button>
      </div>
    </div>
  );
};

export default NuevoUsuario;
