import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Styles_F1.css";
import MessageModal from "../MessageModal";
import axios from "axios";

const Registrotelefonia = () => {
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
      titulo: "",
      texto: "",
      icono: "check", // o "fail"
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
    ip: ""
  });

  const [activeButton, setActiveButton] = useState(""); // controla qué botón fue presionado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrar = async () => {
    try {
      await axios.post(
        "http://172.20.158.193172.20.158.193/inventario_navesoft/backend/RegistroTelefonia.php",
        formData
      );

      setModalConfig({
        titulo: "Registro exitoso",
        texto: "El telefono fue registrado correctamente.",
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
      console.error("Error al registrar telefono:", error);

      setModalConfig({
        titulo: "Error en el registro",
        texto: "No se pudo registrar el telefono.",
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

  return (
    <div className="form-container">
      <h2 className="form-title">Registro de telefonia</h2>
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
              placeholder={`Ingrese ${key}`}
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
