import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Styles_F3.css";

const RegistroEquipos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { usuarioNombre, cedula } = location.state || {};

  const [formData, setFormData] = useState({
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
    observacion: "",
    anydesk: "",
    id_usuario: "",
    activo: "Y"
  });

  const [activeButton, setActiveButton] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    if (mensaje) setMensaje("");
  };

  const validateForm = () => {
    // Campos requeridos según el PHP
    const requiredFields = [
      'usuario', 'ubicacion', 'lugar_uso', 'tipo_equipo', 
      'marca', 'cpu', 'serial', 'memoria_ram', 'disco_mecanico', 
      'disco_ssd', 'ip', 'estado', 'propietario'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());

    if (missingFields.length > 0) {
      setMensaje(`Error: Los siguientes campos son obligatorios: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    console.log("🚀 Iniciando proceso de guardado...");

    if (!validateForm()) {
      console.log("❌ Validación falló");
      return;
    }

    setActiveButton("guardar");
    setIsLoading(true);
    setMensaje("");

    try {
      // Preparar datos para enviar (sin campos de fecha ya que el PHP no los usa)
      const dataToSend = {
        usuario: formData.usuario,
        ubicacion: formData.ubicacion,
        lugar_uso: formData.lugar_uso,
        tipo_equipo: formData.tipo_equipo,
        marca: formData.marca,
        cpu: formData.cpu,
        serial: formData.serial,
        memoria_ram: formData.memoria_ram,
        disco_mecanico: formData.disco_mecanico,
        disco_ssd: formData.disco_ssd,
        ip: formData.ip,
        estado: formData.estado,
        propietario: formData.propietario,
        observacion: formData.observacion || null,
        anydesk: formData.anydesk || null,
        id_usuario: formData.id_usuario || null,
        activo: formData.activo || 'Y'
      };

      console.log("📤 Datos a enviar:", dataToSend);
      console.log("🌐 URL destino:", "http://172.20.158.193172.20.158.193/inventario_navesoft/backend/RegistroEquipos.php");

      const response = await axios.post(
        "http://172.20.158.193172.20.158.193/inventario_navesoft/backend/RegistroEquipos.php",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          timeout: 15000
        }
      );

      console.log("✅ Respuesta recibida!");
      console.log("📥 Status HTTP:", response.status);
      console.log("📥 Datos respuesta:", response.data);

      if (response.data && response.data.success) {
        setMensaje("Equipo registrado exitosamente");
        console.log("🎉 Registro exitoso!");

        // Limpiar formulario manteniendo usuario y cédula
        setFormData((prev) => ({
          cedula: prev.cedula,
          usuario: prev.usuario,
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
          observacion: "",
          anydesk: "",
          id_usuario: "",
          activo: "Y"
        }));
      } else {
        const errorMessage = response.data?.error ||
                             response.data?.message ||
                             "Error inesperado del servidor";
        setMensaje(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("💥 Error completo capturado:", error);
      let errorMessage = "Error de conexión con el servidor";

      if (error.response) {
        if (error.response.status === 400) {
          // El PHP devuelve 400 para errores de negocio
          const serverError = error.response.data?.error || error.response.data?.message;
          if (serverError && serverError.includes('Ya existe un equipo')) {
            errorMessage = "Ya existe un equipo con ese SERIAL o IP. Verifique los datos.";
          } else if (serverError && serverError.includes('unique constraint')) {
            errorMessage = "Error: SERIAL o IP duplicados. Verifique los datos.";
          } else {
            errorMessage = `Error: ${serverError}`;
          }
        } else if (error.response.status === 404) {
          errorMessage = "El endpoint del servidor no fue encontrado (404)";
        } else if (error.response.status === 500) {
          errorMessage = `Error interno del servidor (500): ${error.response.data?.error || 'Sin detalles'}`;
        } else if (error.response.status === 0) {
          errorMessage = "Error de CORS - El servidor rechaza peticiones desde este origen";
        } else {
          errorMessage = `Error HTTP ${error.response.status}: ${error.response.data?.error || error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifique la URL y su conexión.";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Timeout: El servidor tardó demasiado en responder";
      } else {
        errorMessage = `Error: ${error.message}`;
      }

      setMensaje(errorMessage);
    } finally {
      setIsLoading(false);
      setActiveButton("");
      console.log("🏁 Proceso finalizado");
    }
  };

  const handleVerRegistros = () => {
    setActiveButton("ver");
    navigate("/equipos");
  };

  // Campos a mostrar en el formulario (sin fechas ya que el PHP no las maneja)
  const formFields = [
    { key: 'cedula', label: 'CÉDULA', disabled: true },
    { key: 'usuario', label: 'USUARIO', disabled: true, required: true },
    { key: 'ubicacion', label: 'UBICACIÓN', required: true },
    { key: 'lugar_uso', label: 'LUGAR DE USO', required: true },
    { key: 'tipo_equipo', label: 'TIPO DE EQUIPO', required: true },
    { key: 'marca', label: 'MARCA', required: true },
    { key: 'cpu', label: 'CPU', required: true },
    { key: 'serial', label: 'SERIAL', required: true },
    { key: 'memoria_ram', label: 'MEMORIA RAM', required: true },
    { key: 'disco_mecanico', label: 'DISCO MECÁNICO', required: true },
    { key: 'disco_ssd', label: 'DISCO SSD', required: true },
    { key: 'ip', label: 'IP', required: true },
    { key: 'estado', label: 'ESTADO', required: true },
    { key: 'propietario', label: 'PROPIETARIO', required: true },
    { key: 'observacion', label: 'OBSERVACIÓN' },
    { key: 'anydesk', label: 'ANYDESK' },
    { key: 'id_usuario', label: 'ID USUARIO' },
    { key: 'activo', label: 'ACTIVO' }
  ];

  return (
    <div className="form32-containeer">
      <h2 className="form-title">Registro de equipos</h2>

      {mensaje && (
        <div style={{
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "4px",
          backgroundColor: mensaje.startsWith("Error") ? "#ffe6e6" : "#e6ffe6",
          border: `1px solid ${mensaje.startsWith("Error") ? "#ff9999" : "#99ff99"}`,
          color: mensaje.startsWith("Error") ? "#cc0000" : "#006600",
          fontWeight: "bold"
        }}>
          {mensaje}
        </div>
      )}

      <form className="forms21-grid">
        {formFields.map(({ key, label, disabled = false, required = false }) => (
          <div key={key} className="form14-group">
            <label htmlFor={key}>
              {label}
              {required && <span style={{ color: 'red' }}> *</span>}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key] || ""}
              onChange={handleChange}
              placeholder={disabled ? "" : `Ingrese ${label.toLowerCase()}`}
              disabled={disabled}
              required={required}
            />
          </div>
        ))}
      </form>

      <div className="form14-buttons">
        <button
          type="button1"
          onClick={handleVerRegistros}
          className={`custom21-btn ${activeButton === "ver" ? "selected" : ""}`}
          disabled={isLoading}
        >
          Ver Registros
        </button>
        <button
          type="button1"
          onClick={handleGuardar}
          className={`custom21-btn ${activeButton === "guardar" ? "selected" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};

export default RegistroEquipos;