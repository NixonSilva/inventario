import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 🧠 AÑADIR useLocation
import axios from "axios";
import "../styles/Styles_F3.css";

const RegistroEquipos = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 aquí llegan los datos enviados desde navigate()

  const { usuarioNombre, cedula } = location.state || {}; // ⚠️ desestructurar con fallback

  const [formData, setFormData] = useState({
    id: "",
    cedula: "",
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

  // ✅ Autocompletar datos del usuario al cargar
  useEffect(() => {
    if (cedula && usuarioNombre) {
      setFormData((prev) => ({
        ...prev,
        cedula: cedula,
        usuario: usuarioNombre
      }));
    }
  }, [cedula, usuarioNombre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setActiveButton("guardar");
    try {
      const response = await axios.post(
        "http://172.20.158.193/inventario_navesoft/backend/RegistroEquipos.php",
        JSON.stringify(formData), // Enviar como JSON string
        {
          headers: {
            "Content-Type": "application/json" // Muy importante
          }
        }
      );

      if (response.data.success) {
        setMensaje("Equipo registrado exitosamente");
        // Mantener ID y Usuario después de guardar
        setFormData((prev) => ({
          ...prev,
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
        }));
      } else {
        setMensaje(`Error: ${response.data.message || "Error inesperado del servidor"}`);
      }
    } catch (error) {
      console.error("Error al registrar equipo:", error);
      setMensaje("Error de conexión con el servidor");
    }
  };


  const handleVerRegistros = () => {
    setActiveButton("ver");
    navigate("/equipos");
  };

  return (
    <div className="form32-containeer">
      <h2 className="form-title">Registro de equipos</h2>
      {mensaje && <p style={{ color: mensaje.startsWith("Error") ? "red" : "green" }}>{mensaje}</p>}
      <form className="forms-grid">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>{key.replace(/_/g, " ").toUpperCase()}</label>
            <input
              type={key.includes("fecha") ? "date" : "text"}
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={`Ingrese ${key.replace(/_/g, " ")}`}
              disabled={key === "cedula" || key === "usuario"} // desactivar estos campos
            />
          </div>
        ))}
      </form>
      <div className="form14-buttons">
        <button
          type="button6"
          onClick={handleVerRegistros}
          className={`custom2-btn ${activeButton === "ver" ? "selected" : ""}`}
        >
          Ver Registros
        </button>
        <button
          type="button6"
          onClick={handleGuardar}
          className={`custom2-btn ${activeButton === "guardar" ? "selected" : ""}`}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default RegistroEquipos;
