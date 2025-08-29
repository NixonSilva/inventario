import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Styles_F4.css";
import MessageModal from "../MessageModal"; // ✅

const RegistroPerifericos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Obtener datos del usuario desde la navegación
  const { usuarioNombre, cedula } = location.state || {};

  // 🔧 STATE SIN CAMPO ID - el trigger lo asigna automáticamente
  const [formData, setFormData] = useState({
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
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Modal
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    titulo: "",
    texto: "",
    icono: "check",
    buttons: []
  });

  // 🔧 URL del backend
  const API_URL = "http://172.20.158.193/inventario_navesoft/backend/RegistroPerifericos.php";

  // ✅ Efecto para cargar el nombre del usuario responsable
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
    
    // 🔧 Validar longitud máxima (100 caracteres según la tabla Oracle)
    if (value.length > 100) {
      showErrorModal(`El campo ${name.replace(/_/g, ' ').toUpperCase()} no puede exceder 100 caracteres`);
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // 🔧 CAMPOS REQUERIDOS SIN ID
    const requiredFields = [
      'usuario_responsable', 'pantalla_1_marca_modelo', 'pantalla_2_marca_modelo',
      'mouse', 'teclado', 'diadema', 'base_refrigerante', 'base_pantalla',
      'maletin', 'camaras_desktop'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]?.trim());

    if (missingFields.length > 0) {
      setModalConfig({
        titulo: "Campos obligatorios",
        texto: `Faltan los siguientes campos: ${missingFields.map(field => 
          field.replace(/_/g, ' ').toUpperCase()
        ).join(", ")}`,
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

    // 🔧 Validar longitud de campos de texto
    const textFields = [
      'usuario_responsable', 'pantalla_1_marca_modelo', 'pantalla_2_marca_modelo',
      'mouse', 'teclado', 'diadema', 'base_refrigerante', 'base_pantalla',
      'maletin', 'camaras_desktop'
    ];

    for (const field of textFields) {
      if (formData[field] && formData[field].trim().length > 100) {
        showErrorModal(`El campo ${field.replace(/_/g, ' ').toUpperCase()} no puede exceder 100 caracteres`);
        return false;
      }
    }

    return true;
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

  const handleRegistrar = async () => {
    if (!validateForm()) return;

    setActiveButton("guardar");
    setIsLoading(true);

    try {
      // 🔧 DATOS SIN ID - el trigger genera automáticamente el ID
      const dataToSend = { ...formData };

      console.log("Datos a enviar (sin ID):", dataToSend); // 🔍 Para debug

      // 🔧 Configuración de axios sin header Origin problemático
      const response = await axios({
        method: 'POST',
        url: API_URL,
        data: dataToSend,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000,
        withCredentials: false
      });

      console.log("Respuesta del servidor:", response.data); // 🔍 Para debug

      // 🔧 MANEJO MEJORADO DE RESPUESTA DE TU API
      if (response.data && response.data.success === true) {
        // Tu API devuelve 'id_generado', manejar correctamente
        const mensaje = response.data.id_generado 
          ? `Periférico registrado correctamente con ID: ${response.data.id_generado}`
          : response.data.message || "Periférico registrado correctamente";

        setModalConfig({
          titulo: "Registro exitoso",
          texto: mensaje,
          icono: "check",
          buttons: [
            {
              label: "Aceptar",
              onClick: () => setShowModal(false)
            }
          ]
        });
        setShowModal(true);

        // 🔧 LIMPIAR FORMULARIO pero mantener usuario_responsable
        setFormData((prev) => ({
          usuario_responsable: prev.usuario_responsable,
          pantalla_1_marca_modelo: "",
          pantalla_2_marca_modelo: "",
          mouse: "",
          teclado: "",
          diadema: "",
          base_refrigerante: "",
          base_pantalla: "",
          maletin: "",
          camaras_desktop: ""
        }));
      } else {
        // Tu API devuelve success: false con error
        throw new Error(response.data?.error || "Error inesperado del servidor");
      }

    } catch (error) {
      console.error("Error completo:", error); // 🔍 Para debug

      let errorMessage = "Error al registrar el periférico.";

      if (error.response) {
        // Error del servidor (4xx, 5xx)
        console.error("Error response:", error.response.data);
        const serverError = error.response.data?.error || error.response.data?.message;
        
        // 🔧 MANEJO ESPECÍFICO DE ERRORES DE TU API
        if (serverError?.includes("Campo vacío") || serverError?.includes("Campo faltante")) {
          errorMessage = "Error: Todos los campos son obligatorios.";
        } else if (serverError?.includes("JSON inválido")) {
          errorMessage = "Error: Datos inválidos enviados al servidor.";
        } else if (serverError?.includes("Conexión BD falló")) {
          errorMessage = "Error: No se puede conectar a la base de datos.";
        } else if (serverError?.includes("Error INSERT")) {
          errorMessage = "Error: No se pudo guardar en la base de datos.";
        } else if (serverError?.includes("Error parse SQL")) {
          errorMessage = "Error: Problema interno del servidor.";
        } else {
          errorMessage = `Error del servidor: ${serverError}`;
        }
      } else if (error.request) {
        // Error de red/CORS
        console.error("Error request:", error.request);
        if (error.code === 'ERR_NETWORK') {
          errorMessage = "Error de conexión. Verifique su conexión a internet y que el servidor esté disponible.";
        } else if (error.message?.includes("timeout")) {
          errorMessage = "Timeout: El servidor tardó demasiado en responder.";
        } else if (error.message?.includes("CORS")) {
          errorMessage = "Error de CORS. Contacte al administrador del sistema.";
        } else {
          errorMessage = `Error de conexión: ${error.message}`;
        }
      } else {
        // Error de configuración
        console.error("Error message:", error.message);
        errorMessage = `Error: ${error.message}`;
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
    navigate("/perifericos");
  };

  // 🔧 CAMPOS DEL FORMULARIO SIN ID
  const formFields = [
    { key: 'usuario_responsable', label: 'USUARIO RESPONSABLE', required: true, disabled: Boolean(usuarioNombre) },
    { key: 'pantalla_1_marca_modelo', label: 'PANTALLA 1 MARCA MODELO', required: true },
    { key: 'pantalla_2_marca_modelo', label: 'PANTALLA 2 MARCA MODELO', required: true },
    { key: 'mouse', label: 'MOUSE', required: true },
    { key: 'teclado', label: 'TECLADO', required: true },
    { key: 'diadema', label: 'DIADEMA', required: true },
    { key: 'base_refrigerante', label: 'BASE REFRIGERANTE', required: true },
    { key: 'base_pantalla', label: 'BASE PANTALLA', required: true },
    { key: 'maletin', label: 'MALETÍN', required: true },
    { key: 'camaras_desktop', label: 'CÁMARAS DESKTOP', required: true }
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">Registro de periféricos</h2>
      
      {/* 🔧 NOTA INFORMATIVA sobre ID automático */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: '#e3f2fd', 
        border: '1px solid #2196f3', 
        borderRadius: '4px',
        fontSize: '14px',
        color: '#1976d2'
      }}>
        <strong>Nota:</strong> El ID del periférico se asigna automáticamente por el sistema.
      </div>

      <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
        {formFields.map(({ key, label, required = false, disabled = false }) => (
          <div key={key} className="form-group">
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
              placeholder={`Ingrese ${label.toLowerCase()}`}
              disabled={isLoading || disabled}
              maxLength={100}
              required={required}
            />
            {/* 🔧 Contador de caracteres */}
            {formData[key] && (
              <small style={{ 
                color: formData[key].length > 90 ? 'red' : 'gray', 
                fontSize: '0.8em' 
              }}>
                {formData[key].length}/100 caracteres
              </small>
            )}
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
          onClick={handleRegistrar}
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

export default RegistroPerifericos;