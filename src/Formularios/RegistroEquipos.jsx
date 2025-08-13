import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Styles_F3.css";
import MessageModal from "../MessageModal"; // ✅ IMPORTANTE

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
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    titulo: "",
    texto: "",
    icono: "check",
    buttons: []
  });

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

  const validateForm = () => {
    const requiredFields = [
      'usuario', 'ubicacion', 'lugar_uso', 'tipo_equipo',
      'marca', 'cpu', 'serial', 'memoria_ram', 'disco_mecanico',
      'disco_ssd', 'ip', 'estado', 'propietario'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]?.trim());

    if (missingFields.length > 0) {
      setModalConfig({
        titulo: "Campos faltantes",
        texto: `Faltan los siguientes campos: ${missingFields.join(', ')}`,
        icono: "fail",
        buttons: [
          {
            label: "Cerrar",
            onClick: () => setShowModal(false)
          }
        ]
      });
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validateForm()) return;

    setActiveButton("guardar");
    setIsLoading(true);

    try {
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

      const response = await axios.post(
        "http://172.20.158.193/inventario_navesoft/backend/RegistroEquipos.php",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          timeout: 15000
        }
      );

      if (response.data && response.data.success) {
        setModalConfig({
          titulo: "Registro exitoso",
          texto: "El equipo fue registrado correctamente.",
          icono: "check",
          buttons: [
            {
              label: "Aceptar",
              onClick: () => setShowModal(false)
            }
          ]
        });
        setShowModal(true);

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
        throw new Error(response.data?.error || "Error inesperado");
      }
    } catch (error) {
      let errorMessage = "Error al registrar el equipo.";

      if (error.response) {
        const serverError = error.response.data?.error || error.response.data?.message;
        if (serverError?.includes("Ya existe un equipo")) {
          errorMessage = "Ya existe un equipo con ese SERIAL o IP. Verifique los datos.";
        } else if (serverError?.includes("unique constraint")) {
          errorMessage = "Error: SERIAL o IP duplicados. Verifique los datos.";
        } else {
          errorMessage = `Error: ${serverError}`;
        }
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Timeout: El servidor tardó demasiado en responder.";
      }

      setModalConfig({
        titulo: "Error",
        texto: errorMessage,
        icono: "fail",
        buttons: [
          {
            label: "Cerrar",
            onClick: () => setShowModal(false)
          }
        ]
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
      setActiveButton("");
    }
  };

  const handleVerRegistros = () => {
    setActiveButton("ver");
    navigate("/equipos");
  };

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

      <div className="form142-buttons">
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

      {/* ✅ Modal de mensajes */}
      <MessageModal
        show={showModal}
        title={modalConfig.titulo}
        body={modalConfig.texto}
        buttons={modalConfig.buttons}
        imageType={modalConfig.icono}
      />
    </div>
  );
};

export default RegistroEquipos;
