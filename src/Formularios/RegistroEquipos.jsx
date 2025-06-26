import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Styles_F3.css";

const RegistroEquipos = ({ usuarioNombre, cedula }) => {
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
  const [mensaje, setMensaje] = useState("");

  // Autocompletar datos del usuario
  useEffect(() => {
    if (cedula && usuarioNombre) {
      setFormData((prev) => ({
        ...prev,
        id: cedula,
        usuario: usuarioNombre
      }));
    }
  }, [cedula, usuarioNombre]);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar datos al backend (API PHP)
  const handleGuardar = async () => {
    setActiveButton("guardar");
    try {
      const response = await axios.post("http://localhost/api/insertar_equipo.php", formData);
      if (response.data.success) {
        setMensaje("Equipo registrado exitosamente");
        setFormData({
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
      } else {
        setMensaje(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error al registrar equipo:", error);
      setMensaje("Error de conexión con el servidor");
    }
  };

  // Redirigir a lista de registros
  const handleVerRegistros = () => {
    setActiveButton("ver");
    navigate("/equipos");
  };

  return (
    <div className="form-containeer">
      <h2 className="form-title">Registro de equipos</h2>
      {mensaje && <p style={{ color: mensaje.startsWith("Error") ? "red" : "green" }}>{mensaje}</p>}
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
              disabled={key === "id" || key === "usuario"}
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
