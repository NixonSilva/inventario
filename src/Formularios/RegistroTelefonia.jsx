import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Styles_F1.css";
import MessageModal from "../MessageModal";
import axios from "axios";

const Registrotelefonia = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    titulo: "",
    texto: "",
    icono: "check", // "check" o "fail"
    buttons: [],
  });

  const [formData, setFormData] = useState({
    id: "",
    usuarios: "",
    empresa: "",
    ciudad: "",
    lugar: "",
    extension: "",
    contrasena: "",
    zoyper: "",
    marca: "",
    modelo: "",
    ip: "",
  });

  const [camposBloqueados, setCamposBloqueados] = useState({
    id: false,
    usuarios: false,
    empresa: false,
    ciudad: false,
  });

  const [activeButton, setActiveButton] = useState(""); // controla qué botón fue presionado

  // Efecto para cargar datos del usuario si viene de BuscarUsuario
  useEffect(() => {
    if (location.state && location.state.fromBuscarUsuario && location.state.usuarioData) {
      const { usuarioData } = location.state;
      
      // Precargar los datos del usuario (SIN incluir el ID)
      setFormData(prevData => ({
        ...prevData,
        usuarios: usuarioData.usuarios || "",
        empresa: usuarioData.empresa || "",
        ciudad: usuarioData.ciudad || usuarioData.ubicacion || "",
      }));

      // Bloquear los campos que vienen precargados (SIN incluir el ID)
      setCamposBloqueados({
        id: false, // El ID no se bloquea
        usuarios: !!usuarioData.usuarios,
        empresa: !!usuarioData.empresa,
        ciudad: !!(usuarioData.ciudad || usuarioData.ubicacion),
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Solo permitir cambios en campos no bloqueados
    if (!camposBloqueados[name]) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegistrar = async () => {
    try {
      await axios.post(
        "http://172.20.158.193/inventario_navesoft/backend/RegistroTelefonia.php",
        formData
      );

      setModalConfig({
        titulo: "Registro exitoso",
        texto: "El teléfono fue registrado correctamente.",
        icono: "check",
        buttons: [
          {
            label: "Aceptar",
            onClick: () => {
              setShowModal(false);
              navigate("/telefonia");
            },
          },
        ],
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error al registrar teléfono:", error);

      setModalConfig({
        titulo: "Error en el registro",
        texto: "No se pudo registrar el teléfono.",
        icono: "fail",
        buttons: [
          {
            label: "Cerrar",
            onClick: () => setShowModal(false),
          },
        ],
      });
      setShowModal(true);
    }
  };

  const handleVerRegistros = () => {
    setActiveButton("ver");
    navigate("/telefonia");
  };

  // Función para obtener el estilo del campo
  const getFieldStyle = (fieldName) => {
    if (camposBloqueados[fieldName]) {
      return {
        backgroundColor: '#f0f0f0',
        cursor: 'not-allowed',
        border: '2px solid #28a745',
        color: '#495057'
      };
    }
    return {};
  };

  // Función para obtener el placeholder del campo
  const getPlaceholder = (key) => {
    if (camposBloqueados[key]) {
      return `${key.charAt(0).toUpperCase() + key.slice(1)} (precargado)`;
    }
    return `Ingrese ${key}`;
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Registro de Telefonía</h2>
      
      <form className="form-grid">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
              {camposBloqueados[key]}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={getPlaceholder(key)}
              style={getFieldStyle(key)}
              readOnly={camposBloqueados[key]}
              title={camposBloqueados[key] ? 'Campo bloqueado - precargado desde búsqueda de usuario' : ''}
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

      {/* Modal */}
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

export default Registrotelefonia;