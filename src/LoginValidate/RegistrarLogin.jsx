import React, { useState } from "react";
import axios from "axios";
import "../styles/AuthForm.css";

const Registrarse = () => {
  const [formData, setFormData] = useState({
    email: "",
    nombre_completo: "",
    clave: "",
    // Removido: estado y usuario_creacion - se manejan en backend
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipoMensaje, setTipoMensaje] = useState(""); // 'success' o 'error'

  // Obtener usuario actual de diferentes fuentes posibles
  const obtenerUsuarioActual = () => {
    // Opción 1: Desde localStorage (usuario logueado)
    const usuarioLogueado = localStorage.getItem('usuario_actual') || 
                           localStorage.getItem('user_email') ||
                           localStorage.getItem('current_user');
    
    // Opción 2: Desde context/props (si usas Context API)
    // const { usuarioActual } = useContext(AuthContext);
    
    // Opción 3: Desde sessionStorage
    const sessionUser = sessionStorage.getItem('usuario_actual');
    
    // Opción 4: Desde props (si viene de componente padre)
    // props.usuarioActual
    
    // Prioridad: props > localStorage > sessionStorage > default
    return usuarioLogueado || sessionUser || 'sistema';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar mensaje al cambiar campos
    if (mensaje) {
      setMensaje("");
      setTipoMensaje("");
    }
  };

  const validarFormulario = () => {
    if (!formData.email.trim()) {
      setMensaje("El email es obligatorio");
      setTipoMensaje("error");
      return false;
    }
    
    // Validación más estricta de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setMensaje("Formato de email inválido");
      setTipoMensaje("error");
      return false;
    }
    
    if (!formData.nombre_completo.trim()) {
      setMensaje("El nombre completo es obligatorio");
      setTipoMensaje("error");
      return false;
    }
    
    if (formData.nombre_completo.trim().length < 3) {
      setMensaje("El nombre debe tener al menos 3 caracteres");
      setTipoMensaje("error");
      return false;
    }
    
    if (formData.clave.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      setTipoMensaje("error");
      return false;
    }
    
    // Validación de contraseña más robusta
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.clave)) {
      setMensaje("La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número");
      setTipoMensaje("error");
      return false;
    }
    
    return true;
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setLoading(true);
    setMensaje("");
    
    try {
      // Preparar datos con usuario actual
      const datosRegistro = {
        ...formData,
        usuario_creacion: obtenerUsuarioActual()
        // estado se maneja automáticamente en el backend
      };
      
      console.log("Enviando datos:", datosRegistro); // Para debug
      
      const response = await axios.post(
        "https://inventario.navesoft.com/backend/RegisterLogin.php", 
        datosRegistro,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 segundos de timeout
        }
      );
      
      console.log("Respuesta:", response.data); // Para debug
      
      if (response.data.success) {
        setMensaje("Usuario registrado con éxito");
        setTipoMensaje("success");
        
        // Limpiar formulario en caso de éxito
        setFormData({
          email: "",
          nombre_completo: "",
          clave: "",
        });
        
        // Opcional: Redirigir después de un tiempo
        setTimeout(() => {
          // window.location.href = '/login';
          // O usar React Router: navigate('/login');
        }, 2000);
        
      } else {
        setMensaje(response.data.message || "Error desconocido");
        setTipoMensaje("error");
      }
    } catch (error) {
      console.error("Error completo:", error); // Para debug
      
      if (error.response) {
        // El servidor respondió con un código de error
        const errorMessage = error.response.data?.message || 
                           error.response.statusText || 
                           "Error del servidor";
        setMensaje(`Error del servidor: ${errorMessage}`);
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        setMensaje("No se pudo conectar con el servidor. Verifica tu conexión.");
      } else {
        // Error en la configuración de la petición
        setMensaje(`Error: ${error.message}`);
      }
      setTipoMensaje("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegistro}>
        <h2>Registrarse</h2>
        
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="email"
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            name="nombre_completo"
            placeholder="Nombre completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="name"
            minLength={3}
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="clave"
            placeholder="Contraseña (mín. 6 caracteres, incluir mayúscula, minúscula y número)"
            value={formData.clave}
            onChange={handleChange}
            required
            disabled={loading}
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Crear Cuenta"}
        </button>
        
        {mensaje && (
          <div className={`register-mensaje ${tipoMensaje}`}>
            {mensaje}
          </div>
        )}
        
        <p className="login-link">
          ¿Ya tiene cuenta? <a href="/">Iniciar Sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Registrarse;