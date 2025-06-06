import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Styles_F5.css";

const Registroimpresoras = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    ciudad: "",
    empresa: "",
    usuario_responsable: "",
    marca_modelo: "",
    serial: "",
    ip: "",
    estado: "",
    fecha_cambio_toner: "",
    fecha_mantenimiento: "",
    propietario: "",
    observacion: ""
  });

  const [activeButton, setActiveButton] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrar = () => {
    setActiveButton("Guardar");
    console.log("Datos registrados:", formData);
    // Aquí puedes hacer una solicitud POST al backend
  };

  const handleVerRegistros = () => {
    setActiveButton("ver");
    navigate("/impresoras");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Formulario de Registro</h2>
      <form className="form-grid">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>
              {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </label>
            <input
              type={key.includes("fecha") ? "date" : "text"}
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

export default Registroimpresoras;
