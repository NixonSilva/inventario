import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AutoContext";
import { User, Mail, Lock, Edit2, X, Check, Info, ArrowLeft } from 'lucide-react';
import '../styles/MiPerfil.css'

const MiPerfil = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener usuario del contexto
  const [userData, setUserData] = useState({
    ID: '',
    EMAIL: '',
    NOMBRE_COMPLETO: '',
    CLAVE: '',
    ESTADO: '',
    ULTIMA_CONEXION: '',
    USUARIO_CREACION: '',
    USUARIO_MODIFICACION: '',
    FECHA_MODIFICACION: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  // URL base consistente
  const API_BASE_URL = 'http://172.20.158.193/inventario_navesoft/backend/miPerfil.php';

  // Función para obtener datos del perfil (memoizada para evitar re-renders)
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      
      // VERIFICAR que hay usuario autenticado
      if (!user || !user.email) {
        setMessage({ 
          type: 'error', 
          text: 'No se encontraron datos del usuario autenticado. Por favor, inicie sesión nuevamente.' 
        });
        setLoading(false);
        navigate('/login');
        return;
      }
      
      console.log('Obteniendo perfil para usuario:', user);
      
      // USAR DATOS DEL CONTEXTO DE AUTENTICACIÓN
      const userEmail = user.email;
      
      // Preparar headers
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // ESTRATEGIA 1: Enviar email como parámetro en URL (más confiable)
      const url = `${API_BASE_URL}?email=${encodeURIComponent(userEmail)}`;
      
      // ESTRATEGIA 2: También enviar como headers (backup)
      headers['X-User-Email'] = userEmail;
      headers['Authorization'] = `Bearer ${userEmail}`;
      
      console.log('Request URL:', url);
      console.log('Request headers:', headers);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        // Manejar la respuesta según el formato del PHP
        let serverUserData;
        if (data.usuario) {
          serverUserData = data.usuario;
        } else if (data.Consulta && data.Consulta.length > 0) {
          serverUserData = data.Consulta[0];
        } else {
          serverUserData = data;
        }
        
        // Convertir a formato esperado por el frontend
        const formattedData = {
          ID: serverUserData.id || serverUserData.ID || '',
          EMAIL: serverUserData.email || serverUserData.EMAIL || user.email,
          NOMBRE_COMPLETO: serverUserData.nombre_completo || serverUserData.NOMBRE_COMPLETO || user.nombre || '',
          CLAVE: '', // Por seguridad, no mostrar la contraseña
          ESTADO: serverUserData.estado || serverUserData.ESTADO || '',
          ULTIMA_CONEXION: serverUserData.ultima_conexion || serverUserData.ULTIMA_CONEXION || '',
          USUARIO_CREACION: serverUserData.usuario_creacion || serverUserData.USUARIO_CREACION || '',
          USUARIO_MODIFICACION: serverUserData.usuario_modificacion || serverUserData.USUARIO_MODIFICACION || '',
          FECHA_MODIFICACION: serverUserData.fecha_modificacion || serverUserData.FECHA_MODIFICACION || ''
        };
        
        console.log('Datos formateados:', formattedData);
        
        setUserData(formattedData);
        setOriginalData(formattedData);
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.error || errorData.respuesta || 'Error al cargar el perfil');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos del perfil: ' + error.message });
    } finally {
      setLoading(false);
    }
  }, [user, navigate, API_BASE_URL]); // Dependencias del useCallback

  // Verificar autenticación y obtener datos del perfil
  useEffect(() => {
    // Si no hay usuario autenticado, redirigir al login
    if (!user) {
      console.log('Usuario no autenticado, redirigiendo al login');
      navigate('/login');
      return;
    }

    console.log('Usuario autenticado:', user);
    fetchUserProfile();
  }, [user, navigate, fetchUserProfile]); // Ahora fetchUserProfile está memoizada

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...userData });
  };

  const handleCancel = () => {
    setUserData(originalData);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // VERIFICAR que hay usuario autenticado
      if (!user || !user.email) {
        setMessage({ 
          type: 'error', 
          text: 'No se encontraron datos del usuario autenticado. Por favor, inicie sesión nuevamente.' 
        });
        navigate('/login');
        return;
      }
      
      console.log('Actualizando perfil para usuario:', user);
      
      // USAR EMAIL DEL CONTEXTO DE AUTENTICACIÓN
      const userEmail = user.email;
      
      // Preparar headers
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // ESTRATEGIA 1: Enviar como parámetro en URL
      const url = `${API_BASE_URL}?email=${encodeURIComponent(userEmail)}`;
      
      // ESTRATEGIA 2: También enviar como headers (backup)
      headers['X-User-Email'] = userEmail;
      headers['Authorization'] = `Bearer ${userEmail}`;
      
      // Enviar datos actualizados del formulario
      const dataToUpdate = {
        email: userData.EMAIL,
        nombre_completo: userData.NOMBRE_COMPLETO
      };
      
      // Solo agregar clave si se proporcionó una nueva
      if (userData.CLAVE && userData.CLAVE.trim() !== '') {
        dataToUpdate.clave = userData.CLAVE;
      }
      
      console.log('Datos a actualizar:', dataToUpdate);
      console.log('URL de actualización:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(dataToUpdate)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Respuesta de actualización:', result);
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        setIsEditing(false);
        
        // Limpiar la contraseña después de guardar
        const updatedUserData = { ...userData, CLAVE: '' };
        setUserData(updatedUserData);
        setOriginalData(updatedUserData);
        
        // Recargar datos para obtener campos actualizados por el servidor
        await fetchUserProfile();
      } else {
        const errorData = await response.json();
        console.error('Error de actualización:', errorData);
        throw new Error(errorData.error || errorData.respuesta || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error en handleSave:', error);
      setMessage({ type: 'error', text: error.message || 'Error al actualizar el perfil' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString; // Ya viene formateado del procedimiento almacenado
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar mensaje de redirección
  if (!user) {
    return (
      <div className="loading-container">
        <div className="auth-message">
          <h3>Acceso restringido</h3>
          <p>Debe iniciar sesión para ver esta página.</p>
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mi-perfil-container navemar-theme">
      {/* Botón Volver al Inicio */}
      <div className="back-navigation">
        <button 
          className="back-button" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Volver al Inicio
        </button>
      </div>

      <div className="perfil-header">
        <h1 className="perfil-titulo">Mi Perfil</h1>
        <div className="user-info">
          <small>Sesión activa: {user.email}</small>
        </div>
        <div className="btn-group">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="btn btn-primary"
            >
              <Edit2 size={16} />
              Editar
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-success"
              >
                <Check size={16} />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                <X size={16} />
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`mensaje-estado ${
          message.type === 'success' ? 'mensaje-success' : 'mensaje-error'
        }`}>
          {message.text}
        </div>
      )}

      <div className="perfil-grid">
        {/* Información Personal Editable */}
        <div className="perfil-seccion">
          <h2 className="seccion-titulo">
            <User size={20} />
            Información Personal
          </h2>
          
          <div className="form-group">
            <label className="form-label">ID de Usuario</label>
            <input
              type="text"
              value={userData.ID}
              disabled
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} className="icon-inline" />
              Email
            </label>
            <input
              type="email"
              name="EMAIL"
              value={userData.EMAIL}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              name="NOMBRE_COMPLETO"
              value={userData.NOMBRE_COMPLETO}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} className="icon-inline" />
              Contraseña
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="CLAVE"
                value={userData.CLAVE}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
                placeholder={isEditing ? "Ingrese nueva contraseña" : "••••••••"}
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <span className={`estado-badge ${
              userData.ESTADO === 'Activo' ? 'estado-activo' : 'estado-inactivo'
            }`}>
              {userData.ESTADO}
            </span>
          </div>
        </div>

        {/* Información del Sistema (Solo Lectura) */}
        <div className="perfil-seccion sistema-seccion">
          <h2 className="seccion-titulo">
            <Info size={20} />
            Información del Sistema
          </h2>
          
          <div className="sistema-grid">
            <div className="form-group">
              <label className="form-label">
                Última Conexión
              </label>
              <input
                type="text"
                value={formatDate(userData.ULTIMA_CONEXION)}
                disabled
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Usuario de Creación</label>
              <input
                type="text"
                value={userData.USUARIO_CREACION}
                disabled
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Usuario de Modificación</label>
              <input
                type="text"
                value={userData.USUARIO_MODIFICACION}
                disabled
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Modificación</label>
              <input
                type="text"
                value={formatDate(userData.FECHA_MODIFICACION)}
                disabled
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiPerfil;