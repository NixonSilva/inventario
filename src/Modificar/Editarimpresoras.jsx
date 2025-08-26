import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditarImpresoras.css";
import MessageModal from "../MessageModal";

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/actualizarimpresoras.php";
const CONSULTA_API = "http://172.20.158.193/inventario_navesoft/backend/obtenerimpresora.php";

const EditarImpresora = () => {
  const { id } = useParams();
  console.log("ID desde useParams:", id);
  const navigate = useNavigate();

  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    titulo: "",
    texto: "",
    icono: "check", // "check" o "fail"
    buttons: [],
  });

  const [formData, setFormData] = useState({
    id: "",
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
    fecha_creacion: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para convertir fecha de formato Oracle/DD-MM-YYYY a YYYY-MM-DD (para input date)
  const convertirFechaParaInput = (fecha) => {
    if (!fecha) return "";
    
    console.log("Fecha recibida para convertir:", fecha);
    
    // Si ya está en formato YYYY-MM-DD, devolverla tal como está
    if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return fecha;
    }
    
    // Si está en formato DD/MM/YYYY
    if (fecha.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const partes = fecha.split("/");
      if (partes.length === 3) {
        const [dia, mes, año] = partes;
        return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
    }
    
    // Si está en formato DD-MM-YYYY
    if (fecha.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const partes = fecha.split("-");
      if (partes.length === 3) {
        const [dia, mes, año] = partes;
        return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
    }
    
    // Si viene de Oracle como timestamp, extraer solo la fecha
    if (fecha.includes("T")) {
      return fecha.split("T")[0];
    }
    
    // Si es un objeto Date
    if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0];
    }
    
    return "";
  };

  // Función para convertir fecha de YYYY-MM-DD a DD/MM/YYYY (para enviar al backend)
  const convertirFechaParaBackend = (fecha) => {
    if (!fecha) return "";
    
    console.log("Fecha para backend:", fecha);
    
    // Si ya está en formato DD/MM/YYYY, devolverla tal como está
    if (fecha.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return fecha;
    }
    
    // Si está en formato YYYY-MM-DD, convertir a DD/MM/YYYY
    if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const partes = fecha.split("-");
      if (partes.length === 3) {
        const [año, mes, dia] = partes;
        return `${dia}/${mes}/${año}`;
      }
    }
    
    return fecha;
  };

  // Función para validar datos antes de enviar
  const validarDatos = (datos) => {
    const errores = [];
    
    if (!datos.id || isNaN(parseInt(datos.id))) {
      errores.push("ID de la impresora inválido");
    }
    
    // Validar campos obligatorios
    if (!datos.ciudad || !datos.ciudad.trim()) {
      errores.push("El campo Ciudad es obligatorio");
    }
    
    if (!datos.empresa || !datos.empresa.trim()) {
      errores.push("El campo Empresa es obligatorio");
    }
    
    if (!datos.usuario_responsable || !datos.usuario_responsable.trim()) {
      errores.push("El campo Usuario Responsable es obligatorio");
    }
    
    if (!datos.marca_modelo || !datos.marca_modelo.trim()) {
      errores.push("El campo Marca/Modelo es obligatorio");
    }
    
    // Validar formato de IP si está presente
    if (datos.ip && datos.ip.trim()) {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(datos.ip.trim())) {
        errores.push("Formato de IP inválido");
      }
    }
    
    // Validar fechas - ANTES de convertir al formato del backend
    const fechas = ['fecha_cambio_toner', 'fecha_mantenimiento'];
    fechas.forEach(campo => {
      if (datos[campo] && datos[campo].trim()) {
        const fechaInput = datos[campo];
        // Validar formato YYYY-MM-DD (formato del input date)
        if (!fechaInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
          errores.push(`Formato de ${campo.replace('_', ' ')} inválido`);
        }
      }
    });
    
    return errores;
  };

  // Cargar datos de la impresora al iniciar
  useEffect(() => {
    const cargarImpresora = async () => {
      if (!id) {
        setError("ID de impresora no encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Cargando impresora con ID:", id);
        
        const idNumerico = parseInt(id, 10);
        
        if (isNaN(idNumerico)) {
          throw new Error("El ID debe ser un número válido");
        }

        const response = await axios.post(CONSULTA_API, 
          { id: idNumerico },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000 // Timeout de 10 segundos
          }
        );

        console.log("Respuesta del servidor:", response.data);

        if (response.data && response.data.success && response.data.impresora) {
          const impresoraData = {
            ...response.data.impresora,
            id: idNumerico.toString(),
            // Convertir fechas para mostrar en los inputs
            fecha_cambio_toner: convertirFechaParaInput(response.data.impresora.fecha_cambio_toner || ""),
            fecha_mantenimiento: convertirFechaParaInput(response.data.impresora.fecha_mantenimiento || ""),
            // Incluir fecha_creacion pero no la editamos
            fecha_creacion: response.data.impresora.fecha_creacion || ""
          };
          
          setFormData(impresoraData);
          console.log("Datos cargados correctamente:", impresoraData);
        } else {
          throw new Error("No se encontraron datos de la impresora en la respuesta");
        }
      } catch (error) {
        console.error("Error al cargar la impresora:", error);
        let mensajeError = "Error desconocido al cargar los datos";
        
        if (error.code === 'ECONNABORTED') {
          mensajeError = "Tiempo de espera agotado. Verifica tu conexión.";
        } else if (error.response) {
          mensajeError = `Error del servidor: ${error.response.status} - ${error.response.data?.mensaje || error.response.data?.error || error.response.statusText}`;
        } else if (error.request) {
          mensajeError = "No se pudo conectar con el servidor. Verifica que el backend esté funcionando.";
        } else {
          mensajeError = error.message || "Error desconocido al cargar los datos";
        }
        
        setModalConfig({
          titulo: "Error al cargar datos",
          texto: mensajeError,
          icono: "fail",
          buttons: [
            {
              label: "Volver a Impresoras",
              onClick: () => {
                setShowModal(false);
                navigate("/impresoras");
              },
            },
            {
              label: "Reintentar",
              onClick: () => {
                setShowModal(false);
                window.location.reload();
              },
            },
          ],
        });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    cargarImpresora();
  }, [id, navigate]);

  // Actualizar campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    console.log(`Campo ${name} actualizado:`, value);
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id) {
      setModalConfig({
        titulo: "Error de validación",
        texto: "ID de la impresora no encontrado.",
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
      // PRIMERO: Validar datos ANTES de convertir fechas
      const errores = validarDatos(formData);
      if (errores.length > 0) {
        setModalConfig({
          titulo: "Error de validación",
          texto: "Errores encontrados:\n" + errores.join("\n"),
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

      // SEGUNDO: Preparar datos para envío (DESPUÉS de validar)
      const datosParaEnviar = {
        ...formData,
        id: parseInt(formData.id, 10),
        // Convertir fechas al formato esperado por el backend (DD/MM/YYYY)
        fecha_cambio_toner: convertirFechaParaBackend(formData.fecha_cambio_toner),
        fecha_mantenimiento: convertirFechaParaBackend(formData.fecha_mantenimiento),
        // Limpiar espacios en blanco
        ciudad: (formData.ciudad || "").trim(),
        empresa: (formData.empresa || "").trim(),
        usuario_responsable: (formData.usuario_responsable || "").trim(),
        marca_modelo: (formData.marca_modelo || "").trim(),
        serial: (formData.serial || "").trim(),
        ip: (formData.ip || "").trim(),
        estado: (formData.estado || "").trim(),
        propietario: (formData.propietario || "").trim(),
        observacion: (formData.observacion || "").trim()
      };

      console.log("Datos a enviar:", datosParaEnviar);

      const response = await axios.post(API_URL, datosParaEnviar, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000 // Timeout de 15 segundos para actualización
      });

      console.log("Respuesta de actualización:", response.data);
      
      if (response.data.success || response.data.mensaje) {
        setModalConfig({
          titulo: "Actualización exitosa",
          texto: response.data.mensaje || "La impresora fue actualizada correctamente.",
          icono: "check",
          buttons: [
            {
              label: "Aceptar",
              onClick: () => {
                setShowModal(false);
                navigate("/impresoras");
              },
            },
          ],
        });
        setShowModal(true);
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
      
    } catch (error) {
      console.error("Error completo:", error);
      
      let mensajeError = "Error desconocido al actualizar la impresora";
      
      if (error.code === 'ECONNABORTED') {
        mensajeError = "Tiempo de espera agotado. Intenta nuevamente.";
      } else if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            mensajeError = `Error de datos: ${data?.mensaje || data?.error || 'Datos inválidos enviados al servidor'}`;
            break;
          case 404:
            mensajeError = "Endpoint no encontrado. Verifica la URL del backend.";
            break;
          case 500:
            mensajeError = `Error interno del servidor: ${data?.mensaje || data?.error || 'Error en el backend'}`;
            break;
          default:
            mensajeError = `Error ${status}: ${data?.mensaje || data?.error || error.response.statusText}`;
        }
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor. Verifica que el backend esté funcionando.";
      }
      
      setModalConfig({
        titulo: "Error en la actualización",
        texto: mensajeError,
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
      <div className="editar-impresora-container">
        <h2>Cargando datos de la impresora...</h2>
        <p>Por favor espera mientras se cargan los datos.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="editar-impresora-container">
        <h2>Error</h2>
        <p style={{color: 'red', marginBottom: '20px'}}>{error}</p>
        <div className="editar-impresora-buttons">
          <button onClick={() => navigate("/impresoras")}>Volver a Impresoras</button>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-impresora-container">
      <h2 className="editar-impresora-title">Editar Impresora (ID: {formData.id})</h2>
      
      {/* Mostrar fecha de creación como información de solo lectura */}
      {formData.fecha_creacion && (
        <div className="editar-impresora-info">
          <p><strong>Fecha de Creación:</strong> {formData.fecha_creacion}</p>
        </div>
      )}
      
      <form className="editar-impresora-form" onSubmit={handleSubmit}>
        {/* Campo ID oculto */}
        <input type="hidden" name="id" value={formData.id} />
        
        {/* Campos del formulario */}
        <div className="editar-impresora-grid">
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">
              Ciudad
              <span className="editar-impresora-required">*</span>
            </label>
            <input 
              type="text" 
              name="ciudad" 
              value={formData.ciudad || ''} 
              onChange={handleChange}
              className="editar-impresora-input"
              placeholder="Ingrese ciudad"
              maxLength="100"
              required
            />
          </div>
          
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">
              Empresa
              <span className="editar-impresora-required">*</span>
            </label>
            <input 
              type="text" 
              name="empresa" 
              value={formData.empresa || ''} 
              onChange={handleChange}
              className="editar-impresora-input"
              placeholder="Ingrese empresa"
              maxLength="100"
              required
            />
          </div>
          
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">
              Usuario Responsable
              <span className="editar-impresora-required">*</span>
            </label>
            <input 
              type="text" 
              name="usuario_responsable" 
              value={formData.usuario_responsable || ''} 
              onChange={handleChange}
              className="editar-impresora-input"
              placeholder="Ingrese usuario responsable"
              maxLength="100"
              required
            />
          </div>
          
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">
              Marca Modelo
              <span className="editar-impresora-required">*</span>
            </label>
            <input 
              type="text" 
              name="marca_modelo" 
              value={formData.marca_modelo || ''} 
              onChange={handleChange}
              className="editar-impresora-input"
              placeholder="Ingrese marca modelo"
              maxLength="100"
              required
            />
          </div>
          
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">Serial</label>
            <input 
              type="text" 
              name="serial" 
              value={formData.serial || ''} 
              onChange={handleChange}
              className="editar-impresora-input"
              placeholder="Ingrese serial"
              maxLength="50"
            />
          </div>
          
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">IP</label>
            <input 
              type="text" 
              name="ip" 
              value={formData.ip || ''} 
              onChange={handleChange}
              className="editar-impresora-input"
              placeholder="Ingrese ip"
              pattern="^(\d{1,3}\.){3}\d{1,3}$"
              maxLength="15"
            />
          </div>
          
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">Estado</label>
            <input 
              type="text" 
              name="estado" 
              value={formData.estado || ''} 
              onChange={handleChange}
              className="editar-impresora-input"
              placeholder="Ingrese estado"
              maxLength="50"
            />
          </div>
          
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">Fecha Cambio Toner</label>
            <input 
              type="date" 
              name="fecha_cambio_toner" 
              value={formData.fecha_cambio_toner || ''} 
              onChange={handleChange}
              className="editar-impresora-input editar-impresora-date"
            />
          </div>
          
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">Fecha Mantenimiento</label>
            <input 
              type="date" 
              name="fecha_mantenimiento" 
              value={formData.fecha_mantenimiento || ''} 
              onChange={handleChange}
              className="editar-impresora-input editar-impresora-date"
            />
          </div>
          
          <div className="editar-impresora-field">
            <label className="editar-impresora-label">Propietario</label>
            <input 
              type="text" 
              name="propietario" 
              value={formData.propietario || ''} 
              onChange={handleChange}
              className="editar-impresora-input"
              placeholder="Ingrese propietario"
              maxLength="100"
            />
          </div>
          
          <div className="editar-impresora-field editar-impresora-field-full">
            <label className="editar-impresora-label">Observación</label>
            <textarea 
              name="observacion" 
              value={formData.observacion || ''} 
              onChange={handleChange}
              className="editar-impresora-textarea"
              placeholder="Ingrese observación"
              maxLength="500"
              rows="3"
            />
          </div>
        </div>
        
        <div className="editar-impresora-buttons">
          <button type="button" className="editar-impresora-btn-secondary" onClick={() => navigate("/impresoras")}>
            Ver Registros
          </button>
          <button type="submit" className="editar-impresora-btn-primary">
            Guardar
          </button>
        </div>
      </form>

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

export default EditarImpresora;