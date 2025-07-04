import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditarPeriferico.css";
import MessageModal from "../MessageModal";

const API_URL = "http://172.20.158.193/inventario_navesoft/backend/actualizarPeriferico.php";
const CONSULTA_API = "http://172.20.158.193/inventario_navesoft/backend/obtenerPeriferico.php";

const EditarPeriferico = () => {
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para validar datos antes de enviar
  const validarDatos = (datos) => {
    const errores = [];
    
    if (!datos.id || isNaN(parseInt(datos.id))) {
      errores.push("ID del periférico inválido");
    }
    
    // Validar que al menos haya un campo lleno (además del ID y usuario)
    const camposPeriferico = [
      'pantalla_1_marca_modelo', 'pantalla_2_marca_modelo', 'mouse', 
      'teclado', 'diadema', 'base_refrigerante', 'base_pantalla', 
      'maletin', 'camaras_desktop'
    ];
    
    const hayDatos = camposPeriferico.some(campo => 
      datos[campo] && datos[campo].trim() !== ""
    );
    
    if (!hayDatos) {
      errores.push("Debe completar al menos un campo de periférico");
    }
    
    return errores;
  };

  // Cargar datos del periférico al iniciar
  useEffect(() => {
    const cargarPeriferico = async () => {
      if (!id) {
        setError("ID de periférico no encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Cargando periférico con ID:", id);
        
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

        if (response.data && response.data.periferico) {
          const perifericoData = {
            ...response.data.periferico,
            id: idNumerico.toString(),
            // Mapear campos del backend al frontend
            pantalla_1_marca_modelo: response.data.periferico.pantalla_1 || "",
            pantalla_2_marca_modelo: response.data.periferico.pantalla_2 || "",
            // Asegurar que todos los campos sean strings
            usuario_responsable: (response.data.periferico.usuario_responsable || "").toString(),
            mouse: (response.data.periferico.mouse || "").toString(),
            teclado: (response.data.periferico.teclado || "").toString(),
            diadema: (response.data.periferico.diadema || "").toString(),
            base_refrigerante: (response.data.periferico.base_refrigerante || "").toString(),
            base_pantalla: (response.data.periferico.base_pantalla || "").toString(),
            maletin: (response.data.periferico.maletin || "").toString(),
            camaras_desktop: (response.data.periferico.camaras_desktop || "").toString()
          };
          
          setFormData(perifericoData);
          console.log("Datos cargados correctamente:", perifericoData);
        } else {
          throw new Error("No se encontraron datos del periférico en la respuesta");
        }
      } catch (error) {
        console.error("Error al cargar el periférico:", error);
        let mensajeError = "Error desconocido al cargar los datos";
        
        if (error.code === 'ECONNABORTED') {
          mensajeError = "Tiempo de espera agotado. Verifica tu conexión.";
        } else if (error.response) {
          mensajeError = `Error del servidor: ${error.response.status} - ${error.response.data?.mensaje || error.response.statusText}`;
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
              label: "Volver a Periféricos",
              onClick: () => {
                setShowModal(false);
                navigate("/perifericos");
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

    cargarPeriferico();
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
        texto: "ID del periférico no encontrado.",
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
      // Validar datos antes de enviar
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

      // Preparar datos para envío
      const datosParaEnviar = {
        id: parseInt(formData.id, 10),
        // Limpiar espacios en blanco y usar los nombres correctos para el backend
        usuario_responsable: (formData.usuario_responsable || "").trim(),
        pantalla_1_marca_modelo: (formData.pantalla_1_marca_modelo || "").trim(),
        pantalla_2_marca_modelo: (formData.pantalla_2_marca_modelo || "").trim(),
        mouse: (formData.mouse || "").trim(),
        teclado: (formData.teclado || "").trim(),
        diadema: (formData.diadema || "").trim(),
        base_refrigerante: (formData.base_refrigerante || "").trim(),
        base_pantalla: (formData.base_pantalla || "").trim(),
        maletin: (formData.maletin || "").trim(),
        camaras_desktop: (formData.camaras_desktop || "").trim()
      };

      console.log("Datos a enviar:", datosParaEnviar);

      const response = await axios.post(API_URL, datosParaEnviar, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000 // Timeout de 15 segundos para actualización
      });

      console.log("Respuesta de actualización:", response.data);
      
      if (response.data.success || response.data.message) {
        setModalConfig({
          titulo: "Actualización exitosa",
          texto: response.data.message || "El periférico fue actualizado correctamente.",
          icono: "check",
          buttons: [
            {
              label: "Aceptar",
              onClick: () => {
                setShowModal(false);
                navigate("/perifericos");
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
      
      let mensajeError = "Error desconocido al actualizar el periférico";
      
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
      <div className="form2-container">
        <h2>Cargando datos del periférico...</h2>
        <p>Por favor espera mientras se cargan los datos.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form2-container">
        <h2>Error</h2>
        <p style={{color: 'red', marginBottom: '20px'}}>{error}</p>
        <div className="form25-buttons">
          <button onClick={() => navigate("/perifericos")}>Volver a Periféricos</button>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="form2-container">
      <h2>Editar Periférico (ID: {formData.id})</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo ID oculto */}
        <input type="hidden" name="id" value={formData.id} />
        
        {/* Campos del formulario */}
        <div className="form-grid">
          <label>Usuario Responsable:
            <input 
              type="text" 
              name="usuario_responsable" 
              value={formData.usuario_responsable || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="Nombre del usuario responsable"
            />
          </label>
          
          <label>Pantalla 1 (Marca/Modelo):
            <input 
              type="text" 
              name="pantalla_1_marca_modelo" 
              value={formData.pantalla_1_marca_modelo || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="ej: Samsung 24' LED"
            />
          </label>
          
          <label>Pantalla 2 (Marca/Modelo):
            <input 
              type="text" 
              name="pantalla_2_marca_modelo" 
              value={formData.pantalla_2_marca_modelo || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="ej: LG 22' LED"
            />
          </label>
          
          <label>Mouse:
            <input 
              type="text" 
              name="mouse" 
              value={formData.mouse || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="ej: Logitech MX Master 3"
            />
          </label>
          
          <label>Teclado:
            <input 
              type="text" 
              name="teclado" 
              value={formData.teclado || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="ej: Logitech K380"
            />
          </label>
          
          <label>Diadema:
            <input 
              type="text" 
              name="diadema" 
              value={formData.diadema || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="ej: Sony WH-1000XM4"
            />
          </label>
          
          <label>Base Refrigerante:
            <input 
              type="text" 
              name="base_refrigerante" 
              value={formData.base_refrigerante || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="ej: Cooler Master NotePal"
            />
          </label>
          
          <label>Base Pantalla:
            <input 
              type="text" 
              name="base_pantalla" 
              value={formData.base_pantalla || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="ej: Brazo articulado dual"
            />
          </label>
          
          <label>Maletín:
            <input 
              type="text" 
              name="maletin" 
              value={formData.maletin || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="ej: Samsonite 15.6'"
            />
          </label>
          
          <label>Cámaras Desktop:
            <input 
              type="text" 
              name="camaras_desktop" 
              value={formData.camaras_desktop || ''} 
              onChange={handleChange}
              maxLength="100"
              placeholder="ej: Logitech C920 HD"
            />
          </label>
        </div>
        
        <div className="form25-buttons">
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate("/perifericos")}>Cancelar</button>
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

export default EditarPeriferico;