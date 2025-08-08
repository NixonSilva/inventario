import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Briefcase, Save, Edit2, X, Check } from 'lucide-react';
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
    fechaModificacion: '',
    tipoUsuario: '',
    cedula: '',
    nombres: '',
    apellidos: '',
    genero: '',
    fechaNacimiento: '',
    telefono: '',
    celular: '',
    cargo: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Obtener datos del perfil al cargar el componente
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Aquí debes reemplazar con tu endpoint real
      const response = await fetch('http://172.20.158.193/inventario_navesoft/backend/miPerfil.php', {
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
      const response = await fetch('/api/perfil.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        setIsEditing(false);
        setOriginalData({ ...userData });
      } else {
        throw new Error('Error al actualizar el perfil');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setSaving(false);
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
        {/* Información Personal */}
        <div className="perfil-seccion">
          <h2 className="seccion-titulo">
            <User size={20} />
            Información Personal
          </h2>
          
          <div className="form-group">
            <label className="form-label">Cédula</label>
            <input
              type="text"
              name="cedula"
              value={userData.cedula}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombres</label>
            <input
              type="text"
              name="nombres"
              value={userData.nombres}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={userData.apellidos}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Género</label>
            <select
              name="genero"
              value={userData.genero}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-select"
            >
              <option value="">Seleccionar...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} className="icon-inline" />
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={userData.fechaNacimiento}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="perfil-seccion">
          <h2 className="seccion-titulo">
            <Mail size={20} />
            Información de Contacto
          </h2>
          
          <div className="form-group">
            <label className="form-label">Email</label>
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
            <label className="form-label">
              <Phone size={16} className="icon-inline" />
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={userData.telefono}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Celular</label>
            <input
              type="tel"
              name="celular"
              value={userData.celular}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Briefcase size={16} className="icon-inline" />
              Cargo
            </label>
            <input
              type="text"
              name="cargo"
              value={userData.cargo}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="perfil-seccion sistema-seccion">
          <h2 className="seccion-titulo">Información del Sistema</h2>
          
          <div className="sistema-grid">
            <div className="form-group">
              <label className="form-label">Tipo de Usuario</label>
              <input
                type="text"
                value={userData.tipoUsuario}
                disabled
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <span className={`estado-badge ${
                userData.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'
              }`}>
                {userData.estado}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Última Conexión</label>
              <input
                type="text"
                value={userData.ultimaConexion}
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