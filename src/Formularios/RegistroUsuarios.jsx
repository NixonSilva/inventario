import React, { useState, useEffect } from "react";
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
    correo_electronico: "",
    telefono: ""
  });

  // Estados para las opciones de los dropdowns
  const [ubicaciones, setUbicaciones] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [unidadesNegocio, setUnidadesNegocio] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    titulo: "",
    texto: "",
    icono: "check", // o "fail"
    buttons: [],
  });

  // Cargar opciones al montar el componente
  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        setLoading(true);
        
        // Cargar ubicaciones
        const ubicacionesResponse = await axios.get(
          "https://inventario.navesoft.com/backend/ObtenerOpciones.php?tipo=ubicaciones"
        );
        setUbicaciones(ubicacionesResponse.data);

        // Cargar empresas
        const empresasResponse = await axios.get(
          "https://inventario.navesoft.com/backend/ObtenerOpciones.php?tipo=empresas"
        );
        setEmpresas(empresasResponse.data);

        // Cargar unidades de negocio
        const unidadesResponse = await axios.get(
          "https://inventario.navesoft.com/backend/ObtenerOpciones.php?tipo=unidades_negocio"
        );
        setUnidadesNegocio(unidadesResponse.data);

      } catch (error) {
        console.error("Error al cargar opciones:", error);
        setModalConfig({
          titulo: "Error",
          texto: "No se pudieron cargar las opciones de los formularios.",
          icono: "fail",
          buttons: [
            {
              label: "Cerrar",
              onClick: () => setShowModal(false),
            },
          ],
        });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    cargarOpciones();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistrar = async () => {
    // Validar que todos los campos estén llenos
    if (!formData.Id || !formData.nombre || !formData.ubicacion || 
        !formData.empresas || !formData.unidades_negocio || 
        !formData.correo_electronico || !formData.telefono) {
      setModalConfig({
        titulo: "Campos requeridos",
        texto: "Por favor complete todos los campos del formulario.",
        icono: "fail",
        buttons: [
          {
            label: "Cerrar",
            onClick: () => setShowModal(false),
          },
        ],
      });
      setShowModal(true);
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo_electronico)) {
      setModalConfig({
        titulo: "Email inválido",
        texto: "Por favor ingrese un correo electrónico válido.",
        icono: "fail",
        buttons: [
          {
            label: "Cerrar",
            onClick: () => setShowModal(false),
          },
        ],
      });
      setShowModal(true);
      return;
    }

    try {
      await axios.post(
        "https://inventario.navesoft.com/backend/RegistroUsuarios.php",
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

  if (loading) {
    return (
      <div className="form-container">
        <h2 className="form-title">Registro de Usuario</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Cargando opciones...</p>
        </div>
      </div>
    );
  }

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
          Correo Electrónico
          <input
            type="email"
            name="correo_electronico"
            placeholder="correo@ejemplo.com"
            value={formData.correo_electronico}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Teléfono
          <input
            type="tel"
            name="telefono"
            placeholder="Número de teléfono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Ubicación
          <select
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
          >
            <option value="">Seleccione una ubicación</option>
            {ubicaciones.map((ubicacion) => (
              <option key={ubicacion.id} value={ubicacion.id}>
                {ubicacion.nombre}
              </option>
            ))}
          </select>
        </label>
        
        <label>
          Empresa
          <select
            name="empresas"
            value={formData.empresas}
            onChange={handleChange}
          >
            <option value="">Seleccione una empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </option>
            ))}
          </select>
        </label>
        
        <label>
          Unidad de Negocio
          <select
            name="unidades_negocio"
            value={formData.unidades_negocio}
            onChange={handleChange}
          >
            <option value="">Seleccione una unidad de negocio</option>
            {unidadesNegocio.map((unidad) => (
              <option key={unidad.id} value={unidad.id}>
                {unidad.nombre}
              </option>
            ))}
          </select>
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