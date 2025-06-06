import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Styles_F3.css";

const RegistroEquipos = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    usuario: "",
    ubicacion: "",
    lugar_uso: "",
    tipo_equipo: "",
    marca: "",
    cpu: "",
    serial: "",
    memoria_ram: "",
    disco_mecanico: "",
    disco_ssd: "",
    ip: "",
    estado: "",
    propietario: "",
    fecha_entrega: "",
    fecha_devolucion: "",
    fecha_mantenimiento: "",
    observacion: ""
  });

  const [activeButton, setActiveButton] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    setActiveButton("guardar");
    console.log("Datos del equipo registrados:", formData);
    // Aquí puedes enviar los datos al backend si es necesario
  };

  const handleVerRegistros = () => {
    setActiveButton("ver");
    navigate("/equipos");
  };

  return (
    <div className="form-containeer">
      <h2 className="form-title">Formulario de Registro</h2>
      <form className="forms-grid">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>
              {key.replace(/_/g, " ").toUpperCase()}
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
          onClick={handleGuardar}
          className={`custom-btn ${activeButton === "guardar" ? "selected" : ""}`}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default RegistroEquipos;
