import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BuscarUsuario.css";

function BuscarUsuario() {
  const [nombre, setNombre] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Función para buscar usuarios
  const buscarUsuarios = async (nombreBusqueda) => {
    if (nombreBusqueda.length < 3) {
      setUsuarios([]);
      setMostrarDropdown(false);
      return;
    }

    setCargando(true);
    setError("");

    try {
      // Convertir a mayúsculas para que coincida con la BD
      const nombreMayuscula = nombreBusqueda.toUpperCase();
      
      const response = await axios.get(
        `http://172.20.158.193/inventario_navesoft/backend/BuscarUsuario.php?nombre=${encodeURIComponent(nombreMayuscula)}`
      );

      if (response.data.success) {
        setUsuarios(response.data.usuarios);
        setMostrarDropdown(response.data.usuarios.length > 0);
        
        if (response.data.usuarios.length === 0) {
          setError("No se encontraron usuarios");
        }
      } else {
        setError("Error en la búsqueda");
        setUsuarios([]);
        setMostrarDropdown(false);
      }
    } catch (error) {
      setError("Error al buscar usuarios");
      setUsuarios([]);
      setMostrarDropdown(false);
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  // Efecto para buscar automáticamente cuando cambia el nombre
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (nombre.trim()) {
        buscarUsuarios(nombre);
      } else {
        setUsuarios([]);
        setMostrarDropdown(false);
        setError("");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [nombre]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para seleccionar un usuario
  const seleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNombre(usuario.NOMBRE);
    setMostrarDropdown(false);
    setError("");
  };

  // Función para proceder con el usuario seleccionado
  const procederConUsuario = () => {
    if (usuarioSeleccionado) {
      navigate("/Rperifericos", {
        state: {
          usuarioNombre: usuarioSeleccionado.NOMBRE,
          cedula: usuarioSeleccionado.ID,
        },
      });
    } else {
      setError("Por favor seleccione un usuario de la lista");
    }
  };

  // Función para manejar el cambio en el input
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setNombre(valor);
    setUsuarioSeleccionado(null);
    
    if (valor.length < 3) {
      setMostrarDropdown(false);
      setError("");
    }
  };

  // Función para manejar el foco en el input
  const handleInputFocus = () => {
    if (usuarios.length > 0 && nombre.length >= 3) {
      setMostrarDropdown(true);
    }
  };

  return (
    <div className="page-center">
      <div className="buscar-usuario-container">
        <h2>Buscar usuario por nombre</h2>

        {/* Mensaje de confirmación de usuario seleccionado - ARRIBA del input */}
        {usuarioSeleccionado && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            color: '#28a745', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            marginBottom: '15px',
            fontSize: '0.9em',
            textAlign: 'center'
          }}>
            ✓ Usuario seleccionado
          </div>
        )}

        <div className="dropdown-wrapper" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Ingrese nombre del usuario (mínimo 3 caracteres)"
            value={nombre}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={usuarioSeleccionado ? 'usuario-seleccionado-input' : ''}
          />
          
          {cargando && <div className="loading-indicator">Buscando...</div>}

          {/* Lista desplegable */}
          {mostrarDropdown && usuarios.length > 0 && (
            <div className="usuarios-dropdown">
              <div className="dropdown-header">
                Usuarios encontrados ({usuarios.length})
              </div>
              {usuarios.map((usuario, index) => (
                <div
                  key={index}
                  className={`dropdown-item ${usuarioSeleccionado?.ID === usuario.ID ? 'item-selected' : ''}`}
                  onClick={() => seleccionarUsuario(usuario)}
                >
                  <div className="item-nombre">{usuario.NOMBRE}</div>
                  <div className="item-id">ID: {usuario.ID}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <button onClick={() => navigate("/perifericos")}>Ver registros</button>
          <button 
            onClick={procederConUsuario}
            disabled={!usuarioSeleccionado}
            className={usuarioSeleccionado ? '' : 'btn-disabled'}
          >
            Buscar
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {nombre.length > 0 && nombre.length < 3 && (
          <p style={{ color: "#304173" }}>
            Ingrese al menos 3 caracteres para buscar
          </p>
        )}
      </div>
    </div>
  );
}

export default BuscarUsuario;