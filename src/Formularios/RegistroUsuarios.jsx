import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/styles_F2.css";

const NuevoUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Id: "",
    nombre: "",
    ubicacion: "",
    empresas: "",
    unidades_negocio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistrar = async () => {
    try {
      await axios.post("http://172.20.158.193/inventario_navesoft/backend/RegistroUsuarios.php", formData); // <-- Cambia la URL si tu backend tiene otro puerto o ruta
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
          Cedula
          <input
            type="text"
            name="Id"
            placeholder="Cedula"
            value={formData.Id}
            onChange={handleChange}
          />
        </label>
        <label>
          Nombre Completo
          <input
            type="text"
            name="nombre"
            placeholder="Nombre Completo"
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
            name="empresas"
            placeholder="Empresas"
            value={formData.empresas}
            onChange={handleChange}
          />
        </label>
        <label>
          Unidad de Negocio
          <input
            type="text"
            name="unidades_negocio"
            placeholder="Unidad de Negocio"
            value={formData.unidades_negocio}
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
