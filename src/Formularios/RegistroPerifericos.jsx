import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Styles_F4.css";

const RegistroPerifericos = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    usuario_responsable: "",
    pantalla_1_marca_modelo: "",
    pantalla_2_marca_modelo: "",
    mouse: "",
    teclado: "",
    diadema: "",
    base_refrigerante: "",
    base_pantalla: "",
    maletin: "",
    camaras_desktop: ""
  });

  const [activeButton, setActiveButton] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrar = () => {
    setActiveButton("Guardar");
    console.log("Datos registrados:", formData);
    // Aquí podrías hacer un fetch/axios POST al backend
  };

  const handleVerRegistros = () => {
    setActiveButton("ver");
    navigate("/perifericos");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Formulario de Registro</h2>
      <form className="form-grid">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="form-group">
             <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={`Ingrese ${key.replace(/_/g, " ")}`}
            />
          </div>
        ))}
      </form>
      <div className="form-buttons">
        <button
          type="button"
          onClick={handleVerRegistros}
          className={`custom-btn ${activeButton === "ver" ? "selected" : ""}`}
        >
          Ver Registros
        </button>
        <button
          type="button"
          onClick={handleRegistrar}
          className={`custom-btn ${activeButton === "Guardar" ? "selected" : ""}`}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default RegistroPerifericos;
