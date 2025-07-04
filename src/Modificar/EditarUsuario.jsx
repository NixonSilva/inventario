import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditarUsuario.css";
import MessageModal from "../MessageModal"; // ✅ Importa tu modal aquí

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/actualizarUsuario.php";

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    ubicacion: "",
    empresas: "",
    unidades_negocio: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    titulo: "",
    texto: "",
    icono: "check", // "check" o "fail"
    buttons: [],
  });

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(API_URL, {
        id: id,
        nombre: usuario.nombre,
        ubicacion: usuario.ubicacion,
        empresas: usuario.empresas,
        unidades_negocio: usuario.unidades_negocio
      });

      setModalConfig({
        titulo: "Actualización Exitosa",
        texto: "El usuario fue actualizado correctamente.",
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
      console.error("Error al actualizar usuario", error);

      setModalConfig({
        titulo: "Error en la Actualización",
        texto: "No se pudo actualizar el usuario.",
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
    <div className="form-editar-usuario-container">
      <div className="form-editar-usuario-form">
        <h2 className="form-editar-usuario-titulo">Editar Usuario</h2>

        <label className="form-editar-usuario-label">Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          className="form-editar-usuario-input"
        />

        <label className="form-editar-usuario-label">Ubicación:</label>
        <input
          type="text"
          name="ubicacion"
          value={usuario.ubicacion}
          onChange={handleChange}
          className="form-editar-usuario-input"
        />

        <label className="form-editar-usuario-label">Empresa:</label>
        <input
          type="text"
          name="empresas"
          value={usuario.empresas}
          onChange={handleChange}
          className="form-editar-usuario-input"
        />

        <label className="form-editar-usuario-label">Unidad de Negocio:</label>
        <input
          type="text"
          name="unidades_negocio"
          value={usuario.unidades_negocio}
          onChange={handleChange}
          className="form-editar-usuario-input"
        />

        <div className="form141-buttons">
          <button
            className="custom212-btn"
            onClick={() => navigate("/usuarios")}>
            Ver registros
          </button>
          <button
            className="custom212-btn"
            onClick={handleSubmit}>
            Guardar
          </button>
        </div>
      </div>

      {/* Modal de mensaje */}
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

export default EditarUsuario;
