import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditarEquipos.css";

const API_URL = "http://172.20.158.193172.20.158.193/inventario_navesoft/backend/actualizarEquipo.php";
const CONSULTA_API = "http://172.20.158.193172.20.158.193/inventario_navesoft/backend/obtenerEquipo.php";

const EditarEquipo = () => {
  const { id } = useParams();
  console.log("ID desde useParams:", id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    usuario: "",
    ubicacion: "",
    lugar_uso: "",
    tipo_equipo: "",
    marca: "",
    cpu: "",
    serial: "",
    memoria_ram: "",
    disco_mecanico: "",
    disco_ssd: "",
    ip: "",
    estado: "",
    propietario: "",
    fecha_entrega: "",
    fecha_devolucion: "",
    fecha_mantenimiento: "",
    observacion: "",
    anydesk: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para convertir fecha de DD/MM/YYYY a YYYY-MM-DD (para input date)
  const convertirFechaParaInput = (fecha) => {
    if (!fecha) return "";
    
    // Si ya está en formato YYYY-MM-DD, devolverla tal como está
    if (fecha.includes("-") && fecha.length === 10) {
      return fecha;
    }
    
    // Si está en formato DD/MM/YYYY, convertir a YYYY-MM-DD
    if (fecha.includes("/")) {
      const partes = fecha.split("/");
      if (partes.length === 3) {
        const [dia, mes, año] = partes;
        return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
    }
    
    return fecha;
  };

  // Función para convertir fecha de YYYY-MM-DD a DD/MM/YYYY (para enviar al backend)
  const convertirFechaParaBackend = (fecha) => {
    if (!fecha) return "";
    
    // Si ya está en formato DD/MM/YYYY, devolverla tal como está
    if (fecha.includes("/")) {
      return fecha;
    }
    
    // Si está en formato YYYY-MM-DD, convertir a DD/MM/YYYY
    if (fecha.includes("-")) {
      const partes = fecha.split("-");
      if (partes.length === 3) {
        const [año, mes, dia] = partes;
        return `${dia}/${mes}/${año}`;
      }
    }
    
    return fecha;
  };

  // Cargar datos del equipo al iniciar
  useEffect(() => {
    const cargarEquipo = async () => {
      if (!id) {
        setError("ID de equipo no encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Cargando equipo con ID:", id);
        
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

        if (response.data && response.data.equipo) {
          const equipoData = {
            ...response.data.equipo,
            id: idNumerico.toString(),
            // Convertir fechas para mostrar en los inputs
            fecha_entrega: convertirFechaParaInput(response.data.equipo.fecha_entrega || ""),
            fecha_devolucion: convertirFechaParaInput(response.data.equipo.fecha_devolucion || ""),
            fecha_mantenimiento: convertirFechaParaInput(response.data.equipo.fecha_mantenimiento || ""),
            // Asegurar que los campos numéricos sean strings para el formulario
            memoria_ram: (response.data.equipo.memoria_ram || "").toString(),
            disco_mecanico: (response.data.equipo.disco_mecanico || "").toString(),
            disco_ssd: (response.data.equipo.disco_ssd || "").toString()
          };
          
          setFormData(equipoData);
          console.log("Datos cargados correctamente:", equipoData);
        } else {
          throw new Error("No se encontraron datos del equipo en la respuesta");
        }
      } catch (error) {
        console.error("Error al cargar el equipo:", error);
        if (error.code === 'ECONNABORTED') {
          setError("Tiempo de espera agotado. Verifica tu conexión.");
        } else if (error.response) {
          setError(`Error del servidor: ${error.response.status} - ${error.response.data?.mensaje || error.response.statusText}`);
        } else if (error.request) {
          setError("No se pudo conectar con el servidor. Verifica que el backend esté funcionando.");
        } else {
          setError(error.message || "Error desconocido al cargar los datos");
        }
      } finally {
        setLoading(false);
      }
    };

    cargarEquipo();
  }, [id]);

  // Actualizar campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    console.log(`Campo ${name} actualizado:`, value);
  };

  // Validar datos antes de enviar
  const validarDatos = (datos) => {
    const errores = [];
    
    if (!datos.id || isNaN(parseInt(datos.id))) {
      errores.push("ID del equipo inválido");
    }
    
    // Validar formato de IP si está presente
    if (datos.ip && datos.ip.trim()) {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(datos.ip.trim())) {
        errores.push("Formato de IP inválido");
      }
    }
    
    return errores;
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id) {
      alert("Error: ID del equipo no encontrado");
      return;
    }

    try {
      // Preparar datos para envío
      const datosParaEnviar = {
        ...formData,
        id: parseInt(formData.id, 10),
        // Convertir fechas al formato esperado por el backend
        fecha_entrega: convertirFechaParaBackend(formData.fecha_entrega),
        fecha_devolucion: convertirFechaParaBackend(formData.fecha_devolucion),
        fecha_mantenimiento: convertirFechaParaBackend(formData.fecha_mantenimiento),
        // Limpiar espacios en blanco
        usuario: (formData.usuario || "").trim(),
        ubicacion: (formData.ubicacion || "").trim(),
        lugar_uso: (formData.lugar_uso || "").trim(),
        tipo_equipo: (formData.tipo_equipo || "").trim(),
        marca: (formData.marca || "").trim(),
        cpu: (formData.cpu || "").trim(),
        serial: (formData.serial || "").trim(),
        ip: (formData.ip || "").trim(),
        estado: (formData.estado || "").trim(),
        propietario: (formData.propietario || "").trim(),
        observacion: (formData.observacion || "").trim(),
        anydesk: (formData.anydesk || "").trim()
      };

      // Validar datos
      const errores = validarDatos(datosParaEnviar);
      if (errores.length > 0) {
        alert("Errores de validación:\n" + errores.join("\n"));
        return;
      }

      console.log("Datos a enviar:", datosParaEnviar);

      const response = await axios.post(API_URL, datosParaEnviar, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000 // Timeout de 15 segundos para actualización
      });

      console.log("Respuesta de actualización:", response.data);
      
      if (response.data.success || response.data.mensaje) {
        alert(response.data.mensaje || "Equipo actualizado correctamente.");
        navigate("/equipos");
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
      
    } catch (error) {
      console.error("Error completo:", error);
      
      let mensajeError = "Error desconocido al actualizar el equipo";
      
      if (error.code === 'ECONNABORTED') {
        mensajeError = "Tiempo de espera agotado. Intenta nuevamente.";
      } else if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            mensajeError = `Error de datos: ${data?.mensaje || 'Datos inválidos enviados al servidor'}`;
            break;
          case 404:
            mensajeError = "Endpoint no encontrado. Verifica la URL del backend.";
            break;
          case 500:
            mensajeError = `Error interno del servidor: ${data?.mensaje || 'Error en el backend'}`;
            break;
          default:
            mensajeError = `Error ${status}: ${data?.mensaje || error.response.statusText}`;
        }
      } else if (error.request) {
        mensajeError = "No se pudo conectar con el servidor. Verifica que el backend esté funcionando.";
      }
      
      alert("Error al actualizar equipo:\n" + mensajeError);
    }
  };

  if (loading) {
    return (
      <div className="form2-container">
        <h2>Cargando datos del equipo...</h2>
        <p>Por favor espera mientras se cargan los datos.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form2-container">
        <h2>Error</h2>
        <p style={{color: 'red', marginBottom: '20px'}}>{error}</p>
        <div className="form-buttons">
          <button onClick={() => navigate("/equipos")}>Volver a Equipos</button>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="form2-container">
      <h2>Editar Equipo (ID: {formData.id})</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo ID oculto */}
        <input type="hidden" name="id" value={formData.id} />
        
        {/* Campos del formulario */}
        <div className="form-grid">
          <label>Usuario:
            <input 
              type="text" 
              name="usuario" 
              value={formData.usuario || ''} 
              onChange={handleChange}
              maxLength="100"
            />
          </label>
          
          <label>Ubicación:
            <input 
              type="text" 
              name="ubicacion" 
              value={formData.ubicacion || ''} 
              onChange={handleChange}
              maxLength="100"
            />
          </label>
          
          <label>Lugar de Uso:
            <input 
              type="text" 
              name="lugar_uso" 
              value={formData.lugar_uso || ''} 
              onChange={handleChange}
              maxLength="100"
            />
          </label>
          
          <label>Tipo de Equipo:
            <input 
              type="text" 
              name="tipo_equipo" 
              value={formData.tipo_equipo || ''} 
              onChange={handleChange}
              maxLength="50"
            />
          </label>
          
          <label>Marca:
            <input 
              type="text" 
              name="marca" 
              value={formData.marca || ''} 
              onChange={handleChange}
              maxLength="50"
            />
          </label>
          
          <label>CPU:
            <input 
              type="text" 
              name="cpu" 
              value={formData.cpu || ''} 
              onChange={handleChange}
              maxLength="100"
            />
          </label>
          
          <label>Serial:
            <input 
              type="text" 
              name="serial" 
              value={formData.serial || ''} 
              onChange={handleChange}
              maxLength="50"
            />
          </label>
          
          <label>RAM (GB):
            <input 
              type="text" 
              name="memoria_ram" 
              value={formData.memoria_ram || ''} 
              onChange={handleChange}
              placeholder="ej: 8"
            />
          </label>
          
          <label>HDD (GB):
            <input 
              type="text" 
              name="disco_mecanico" 
              value={formData.disco_mecanico || ''} 
              onChange={handleChange}
              placeholder="ej: 500"
            />
          </label>
          
          <label>SSD (GB):
            <input 
              type="text" 
              name="disco_ssd" 
              value={formData.disco_ssd || ''} 
              onChange={handleChange}
              placeholder="ej: 256"
            />
          </label>
          
          <label>Dirección IP:
            <input 
              type="text" 
              name="ip" 
              value={formData.ip || ''} 
              onChange={handleChange}
              placeholder="ej: 192.168.1.100"
              pattern="^(\d{1,3}\.){3}\d{1,3}$"
            />
          </label>
          
          <label>Estado:
            <input 
              type="text" 
              name="estado" 
              value={formData.estado || ''} 
              onChange={handleChange}
              maxLength="50"
            />
          </label>
          
          <label>Propietario:
            <input 
              type="text" 
              name="propietario" 
              value={formData.propietario || ''} 
              onChange={handleChange}
              maxLength="100"
            />
          </label>
          
          <label>Fecha de Entrega:
            <input 
              type="date" 
              name="fecha_entrega" 
              value={formData.fecha_entrega || ''} 
              onChange={handleChange} 
            />
          </label>
          
          <label>Fecha Devolución:
            <input 
              type="date" 
              name="fecha_devolucion" 
              value={formData.fecha_devolucion || ''} 
              onChange={handleChange} 
            />
          </label>
          
          <label>Fecha Mantenimiento:
            <input 
              type="date" 
              name="fecha_mantenimiento" 
              value={formData.fecha_mantenimiento || ''} 
              onChange={handleChange} 
            />
          </label>
          
          <label>Observación:
            <input 
              type="text" 
              name="observacion" 
              value={formData.observacion || ''} 
              onChange={handleChange}
              maxLength="255"
            />
          </label>
          
          <label>AnyDesk:
            <input 
              type="text" 
              name="anydesk" 
              value={formData.anydesk || ''} 
              onChange={handleChange}
              maxLength="50"
            />
          </label>
        </div>
        
        <div className="form-buttons">
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate("/equipos")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditarEquipo;