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
      const response = await fetch('https://inventario.navesoft.com/backend/forgot-password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Se ha enviado un enlace de recuperación a su correo electrónico');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(data.message || 'Error al procesar la solicitud');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error de conexión. Inténtelo nuevamente');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Redirigir al login principal
    window.location.href = '/LoginInventario';
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
      textAlign: 'center'
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
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              style={styles.input}
              disabled={isLoading}
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
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
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