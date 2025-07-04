import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/styles_F2.css";
import MessageModal from "../MessageModal";

const NuevoUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Id: "",
    nombre: "",
    ubicacion: "",
    empresas: "",
    unidades_negocio: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    titulo: "",
    texto: "",
    icono: "check", // o "fail"
    buttons: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistrar = async () => {
    try {
      await axios.post(
        "http://172.20.158.193/inventario_navesoft/backend/RegistroUsuarios.php",
        formData
      );

      setModalConfig({
        titulo: "Registro exitoso",
        texto: "El usuario fue registrado correctamente.",
        icono: "check",
        buttons: [
          {
            label: "Aceptar",
            onClick: () => {
              setShowModal(false);
              navigate("/usuarios");
            },
          },
        ],
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      setModalConfig({
        titulo: "Error en el registro",
        texto: "No se pudo registrar el usuario.",
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

  return (
    <div className="form-container">
      <h2 className="form-title">Registro de Usuario</h2>
      <div className="form-grid-simplificado">
        <label>
          Cédula
          <input
            type="text"
            name="Id"
            placeholder="Cédula"
            value={formData.Id}
            onChange={handleChange}
          />
        </label>
        <label>
          Nombre Completo
          <input
            type="text"
            name="nombre"
            placeholder="Nombre Completo"
            value={formData.nombre}
            onChange={handleChange}
          />
        </label>
        <label>
          Ubicación
          <input
            type="text"
            name="ubicacion"
            placeholder="Ubicación"
            value={formData.ubicacion}
            onChange={handleChange}
          />
        </label>
        <label>
          Empresa
          <input
            type="text"
            name="empresas"
            placeholder="Empresa"
            value={formData.empresas}
            onChange={handleChange}
          />
        </label>
        <label>
          Unidad de Negocio
          <input
            type="text"
            name="unidades_negocio"
            placeholder="Unidad de Negocio"
            value={formData.unidades_negocio}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="form-botones">
        <button className="btn-estilo" onClick={() => navigate("/usuarios")}>
          Registros
        </button>
        <button className="btn-estilo" onClick={handleRegistrar}>
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

export default NuevoUsuario;
