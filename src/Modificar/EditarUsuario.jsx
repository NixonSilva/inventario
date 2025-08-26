import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditarUsuario.css";
import MessageModal from "../MessageModal";

const API_URL_UPDATE = "https://inventario.navesoft.com/backend/actualizarUsuario.php";
const API_URL_GET = "https://inventario.navesoft.com/backend/obtenerUsuario.php";

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    ubicacion: "",
    empresas: "",
    unidades_negocio: ""
  });

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    titulo: "",
    texto: "",
    icono: "check", // "check" o "fail"
    buttons: [],
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (!id) return;

    const cargarUsuario = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL_GET}?id=${id}`);
        
        setUsuario({
          nombre: response.data.nombre || "",
          correo: response.data.correo || "",
          ubicacion: response.data.ubicacion || "",
          empresas: response.data.empresas || "",
          unidades_negocio: response.data.unidades_negocio || ""
        });
      } catch (error) {
        console.error("Error al cargar usuario", error);
        
        setModalConfig({
          titulo: "Error al Cargar Usuario",
          texto: "No se pudo cargar la información del usuario.",
          icono: "fail",
          buttons: [
            {
              label: "Volver",
              onClick: () => {
                setShowModal(false);
                navigate("/usuarios");
              },
            },
          ],
        });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [id, navigate]);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(API_URL_UPDATE, {
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

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="form-editar-usuario-container">
        <div className="form-editar-usuario-form">
          <h2 className="form-editar-usuario-titulo">Cargando datos...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="form-editar-usuario-container">
      <div className="form-editar-usuario-form">
        <h2 className="form-editar-usuario-titulo">Editar Usuario</h2>

        <label className="form-editar-usuario-label">Nombre completo:</label>
        <input
          type="text"
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          className="form-editar-usuario-input"
        />

        <label className="form-editar-usuario-label">Correo:</label>
        <input
          type="email"
          name="correo"
          value={usuario.correo}
          onChange={handleChange}
          className="form-editar-usuario-input"
          disabled // El correo generalmente no se edita
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