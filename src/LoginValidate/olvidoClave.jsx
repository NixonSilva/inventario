import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!email) {
      setMessage('Por favor ingrese su correo electrónico');
      setMessageType('error');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Por favor ingrese un correo electrónico válido');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      console.log('Enviando solicitud de reset para:', email);
      
      const response = await fetch('http://172.20.158.193/inventario_navesoft/backend/forgot-password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase() 
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      // Obtener el texto crudo de la respuesta primero
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      // Si el status es 200 y el correo funciona, asumir éxito
      if (response.status === 200) {
        // Intentar parsear JSON, pero no fallar si no se puede
        let data = null;
        try {
          if (responseText.trim()) {
            data = JSON.parse(responseText);
            console.log('Parsed data:', data);
          }
        } catch (jsonError) {
          console.log('JSON Parse Error (but status 200, assuming success):', jsonError);
        }
        
        // Si tenemos data válida, usar su mensaje, sino usar mensaje por defecto
        if (data && data.success !== false) {
          setMessage(
            data.message || 
            'Se ha enviado un enlace de recuperación a su correo electrónico. Revise su bandeja de entrada y carpeta de spam.'
          );
          setMessageType('success');
          setEmail('');
          
          if (data.user_name) {
            console.log('Usuario encontrado:', data.user_name);
          }
        } else if (data && data.success === false) {
          // Respuesta válida pero con error
          setMessage(data.message || 'Error al procesar la solicitud');
          setMessageType('error');
        } else {
          // No hay JSON válida pero status 200, asumir éxito
          setMessage('Se ha enviado un enlace de recuperación a su correo electrónico. Revise su bandeja de entrada y carpeta de spam.');
          setMessageType('success');
          setEmail('');
        }
        
        console.log('Email enviado exitosamente a:', email);
        return;
      }
      
      // Si el status no es 200, es un error
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      
      // Manejar diferentes tipos de errores de red/conexión
      let errorMessage = 'Error de conexión. Inténtelo nuevamente';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar al servidor. Verifique su conexión a internet.';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Error de comunicación con el servidor. Contacte al administrador.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'La solicitud tardó demasiado. Por favor inténtelo nuevamente.';
      }
      
      setMessage(errorMessage);
      setMessageType('error');
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Redirigir al login principal
    window.location.href = '/LoginInventario';
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Limpiar mensaje cuando el usuario empiece a escribir
    if (message) {
      setMessage('');
    }
  };

  // Estilos CSS como objeto JavaScript
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      width: '100%',
      maxWidth: '400px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '14px',
      margin: '0',
      lineHeight: '1.5'
    },
    formGroup: {
      marginBottom: '16px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    button: {
      width: '100%',
      padding: '12px 24px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      marginBottom: '16px'
    },
    buttonHover: {
      backgroundColor: '#2563eb'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    alert: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px',
      textAlign: 'center',
      lineHeight: '1.4'
    },
    alertSuccess: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#16a34a'
    },
    alertError: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626'
    },
    backLink: {
      textAlign: 'center',
      marginTop: '16px'
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500'
    },
    linkHover: {
      textDecoration: 'underline'
    },
    helpText: {
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'center',
      marginTop: '12px',
      lineHeight: '1.4'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Recuperar Contraseña</h2>
          <p style={styles.subtitle}>
            Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña
          </p>
        </div>
        
        <div>
          <div style={styles.formGroup}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit(e)}
              style={styles.input}
              disabled={isLoading}
              maxLength={255}
              autoComplete="email"
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email.trim()}
            style={{
              ...styles.button,
              ...((isLoading || !email.trim()) ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!isLoading && email.trim()) {
                e.target.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && email.trim()) {
                e.target.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </button>
        </div>

        {message && (
          <div style={{
            ...styles.alert,
            ...(messageType === 'success' ? styles.alertSuccess : styles.alertError)
          }}>
            {message}
          </div>
        )}

        {messageType === 'success' && (
          <div style={styles.helpText}>
            <p>📧 Revise su bandeja de entrada y carpeta de spam</p>
            <p>🔒 El enlace expirará en 2 horas por seguridad</p>
          </div>
        )}

        <div style={styles.backLink}>
          <button
            onClick={handleBackToLogin}
            style={{
              ...styles.link,
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;