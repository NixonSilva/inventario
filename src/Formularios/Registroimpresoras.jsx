import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Styles_F5.css";
import MessageModal from "../MessageModal"; // ✅

const Registroimpresoras = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { usuarioNombre, cedula } = location.state || {};

  const [formData, setFormData] = useState({
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
    observacion: "",
    activo: "Y"
  });

  const [activeButton, setActiveButton] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Modal
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
        usuario_responsable: usuarioNombre
      }));
    }
  }, [cedula, usuarioNombre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      'ciudad', 'empresa', 'usuario_responsable', 'marca_modelo',
      'serial', 'ip', 'estado', 'propietario'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]?.trim());

    if (missingFields.length > 0) {
      setModalConfig({
        titulo: "Campos obligatorios",
        texto: `Faltan los siguientes campos: ${missingFields.join(", ")}`,
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

    if (formData.fecha_cambio_toner && !isValidDate(formData.fecha_cambio_toner)) {
      showErrorModal("Error: Formato de fecha de cambio de toner inválido");
      return false;
    }

    if (formData.fecha_mantenimiento && !isValidDate(formData.fecha_mantenimiento)) {
      showErrorModal("Error: Formato de fecha de mantenimiento inválido");
      return false;
    }

    return true;
  };

  const isValidDate = (dateString) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const showErrorModal = (mensaje) => {
    setModalConfig({
      titulo: "Error en el formulario",
      texto: mensaje,
      icono: "fail",
      buttons: [
        {
          label: "Cerrar",
          onClick: () => setShowModal(false)
        }
      ]
    });
    setShowModal(true);
  };

  const handleGuardar = async () => {
    if (!validateForm()) return;

    setActiveButton("guardar");
    setIsLoading(true);

    try {
      const dataToSend = {
        ciudad: formData.ciudad,
        empresa: formData.empresa,
        usuario_responsable: formData.usuario_responsable,
        marca_modelo: formData.marca_modelo,
        serial: formData.serial,
        ip: formData.ip,
        estado: formData.estado,
        fecha_cambio_toner: formData.fecha_cambio_toner || null,
        fecha_mantenimiento: formData.fecha_mantenimiento || null,
        propietario: formData.propietario,
        observacion: formData.observacion || null,
        activo: formData.activo || 'Y'
      };

      const response = await axios.post(
        "http://172.20.158.193/inventario_navesoft/backend/RegistroImpresoras.php",
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
          texto: "La impresora fue registrada correctamente.",
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
          ciudad: "",
          empresa: "",
          usuario_responsable: prev.usuario_responsable,
          marca_modelo: "",
          serial: "",
          ip: "",
          estado: "",
          fecha_cambio_toner: "",
          fecha_mantenimiento: "",
          propietario: "",
          observacion: "",
          activo: "Y"
        }));
      } else {
        throw new Error(response.data?.error || "Error inesperado del servidor");
      }
    } catch (error) {
      let errorMessage = "Error al registrar la impresora.";

      if (error.response) {
        const serverError = error.response.data?.error || error.response.data?.message;
        if (serverError?.includes("Ya existe una impresora")) {
          errorMessage = "Ya existe una impresora con ese SERIAL o IP.";
        } else if (serverError?.includes("unique constraint")) {
          errorMessage = "Error: SERIAL o IP duplicados.";
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
    navigate("/impresoras");
  };

  const formFields = [
    { key: 'ciudad', label: 'CIUDAD', required: true },
    { key: 'empresa', label: 'EMPRESA', required: true },
    { key: 'usuario_responsable', label: 'USUARIO RESPONSABLE', required: true },
    { key: 'marca_modelo', label: 'MARCA MODELO', required: true },
    { key: 'serial', label: 'SERIAL', required: true },
    { key: 'ip', label: 'IP', required: true },
    { key: 'estado', label: 'ESTADO', required: true },
    { key: 'fecha_cambio_toner', label: 'FECHA CAMBIO TONER', type: 'date' },
    { key: 'fecha_mantenimiento', label: 'FECHA MANTENIMIENTO', type: 'date' },
    { key: 'propietario', label: 'PROPIETARIO', required: true },
    { key: 'observacion', label: 'OBSERVACIÓN' },
    { key: 'activo', label: 'ACTIVO' }
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">Registro de impresoras</h2>

      <form className="form-grid">
        {formFields.map(({ key, label, required = false, type = 'text' }) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>
              {label}
              {required && <span style={{ color: 'red' }}> *</span>}
            </label>
            <input
              type={type}
              id={key}
              name={key}
              value={formData[key] || ""}
              onChange={handleChange}
              placeholder={type === 'date' ? "" : `Ingrese ${label.toLowerCase()}`}
              required={required}
            />
          </div>
        ))}
      </form>

      <div className="form-buttons">
        <button
          type="button"
          onClick={handleVerRegistros}
          className={`custom-btn ${activeButton === "ver" ? "selected" : ""}`}
          disabled={isLoading}
        >
          Ver Registros
        </button>
        <button
          type="button"
          onClick={handleGuardar}
          className={`custom-btn ${activeButton === "guardar" ? "selected" : ""}`}
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

export default Registroimpresoras;
