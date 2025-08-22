import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Edit2, X, Check, Info } from 'lucide-react';
import '../styles/MiPerfil.css'

const MiPerfil = () => {
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    nombreCompleto: '',
    clave: '',
    estado: '',
    ultimaConexion: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    fechaModificacion: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Obtener datos del perfil al cargar el componente
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://inventario.navesoft.com/backend/backend/miPerfil.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setOriginalData(data);
      } else {
        throw new Error('Error al cargar el perfil');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar los datos del perfil' });
    } finally {
      setLoading(false);
    }
  };

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
      // Solo enviamos los campos que pueden ser editados
      const dataToUpdate = {
        id: userData.id,
        email: userData.email,
        nombreCompleto: userData.nombreCompleto,
        clave: userData.clave
      };

      const response = await fetch('/api/perfil.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToUpdate)
      });

      if (response.ok) {
        await response.json();
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        setIsEditing(false);
        setOriginalData({ ...userData });
        // Recargar datos para obtener campos actualizados por el servidor
        await fetchUserProfile();
      } else {
        throw new Error('Error al actualizar el perfil');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString('es-ES');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="mi-perfil-container navemar-theme">
      <div className="perfil-header">
        <h1 className="perfil-titulo">Mi Perfil</h1>
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
              value={userData.id}
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
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              name="nombreCompleto"
              value={userData.nombreCompleto}
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
                name="clave"
                value={userData.clave}
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
              userData.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'
            }`}>
              {userData.estado}
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
                value={formatDate(userData.ultimaConexion)}
                disabled
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Usuario de Creación</label>
              <input
                type="text"
                value={userData.usuarioCreacion}
                disabled
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Usuario de Modificación</label>
              <input
                type="text"
                value={userData.usuarioModificacion}
                disabled
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Modificación</label>
              <input
                type="text"
                value={formatDate(userData.fechaModificacion)}
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