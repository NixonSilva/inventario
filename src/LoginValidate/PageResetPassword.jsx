import React, { useState, useEffect } from 'react';
import { Eye as EyeOpenIcon, EyeOff as EyeClosedIcon } from 'lucide-react';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Extraer token de la URL al cargar el componente
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setMessage('Token no válido o enlace incompleto');
      setMessageType('error');
      setTokenValid(false);
    }
  }, []);

  const validateToken = async (tokenToValidate) => {
    try {
      const response = await fetch('http://172.20.158.193/inventario_navesoft/backend/validate-reset-token.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token: tokenToValidate }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setTokenValid(true);
        setUserEmail(data.email || '');
        setUserName(data.user_name || '');
        setMessage('');
      } else {
        setTokenValid(false);
        setMessage(data.message || 'Token inválido o expirado');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setTokenValid(false);
      setMessage('Error de conexión. Inténtelo nuevamente');
      setMessageType('error');
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Validaciones
    if (!newPassword || !confirmPassword) {
      setMessage('Por favor complete todos los campos');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      setMessageType('error');
      return;
    }

    // Validación adicional de seguridad
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://172.20.158.193/inventario_navesoft/backend/reset-password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          token: token,
          new_password: newPassword
        }),
      });

      // Verificar si la respuesta tiene contenido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Response is not JSON:', textResponse);
        throw new Error('El servidor no retornó una respuesta JSON válida');
      }

      const data = await response.json();
      
      if (data.success) {
        setMessage('¡Contraseña actualizada exitosamente! Será redirigido al login en 3 segundos...');
        setMessageType('success');
        
        // Limpiar formulario
        setNewPassword('');
        setConfirmPassword('');
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          window.location.href = '/LoginInventario';
        }, 3000);
        
      } else {
        setMessage(data.message || 'Error al actualizar la contraseña');
        setMessageType('error');
      }
      
    } catch (error) {
      console.error('Error resetting password:', error);
      
      if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        setMessage('Error de comunicación con el servidor. Inténtelo nuevamente.');
      } else {
        setMessage(error.message || 'Error de conexión. Inténtelo nuevamente');
      }
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/LoginInventario';
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Muy débil', color: '#dc2626' };
      case 2: return { text: 'Débil', color: '#ea580c' };
      case 3: return { text: 'Media', color: '#ca8a04' };
      case 4: return { text: 'Fuerte', color: '#16a34a' };
      case 5: return { text: 'Muy fuerte', color: '#15803d' };
      default: return { text: '', color: '#6b7280' };
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthInfo = getStrengthText(passwordStrength);

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
      marginBottom: '16px',
      position: 'relative'
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
    passwordInput: {
      paddingRight: '50px'
    },
    eyeIcon: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#6b7280',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px'
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
    alertWarning: {
      backgroundColor: '#fffbeb',
      border: '1px solid #fed7aa',
      color: '#ea580c'
    },
    strengthMeter: {
      marginTop: '8px'
    },
    strengthBar: {
      height: '4px',
      backgroundColor: '#e5e7eb',
      borderRadius: '2px',
      overflow: 'hidden'
    },
    strengthFill: {
      height: '100%',
      transition: 'all 0.3s ease',
      borderRadius: '2px'
    },
    strengthText: {
      fontSize: '12px',
      marginTop: '4px',
      textAlign: 'right'
    },
    userInfo: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
      fontSize: '14px',
      color: '#475569'
    },
    backLink: {
      textAlign: 'center',
      marginTop: '16px'
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    },
    requirements: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '8px',
      lineHeight: '1.4'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid #ffffff40',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    }
  };

  // Loading inicial del token
  if (tokenValid === null) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Verificando enlace...</h2>
            <p style={styles.subtitle}>Por favor espere mientras validamos su solicitud</p>
          </div>
        </div>
      </div>
    );
  }

  // Token inválido
  if (tokenValid === false) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Enlace Inválido</h2>
            <p style={styles.subtitle}>
              El enlace de recuperación no es válido, ha expirado o ya fue utilizado
            </p>
          </div>
          
          {message && (
            <div style={{...styles.alert, ...styles.alertError}}>
              {message}
            </div>
          )}

          <div style={styles.backLink}>
            <button onClick={handleBackToLogin} style={styles.link}>
              ← Volver al inicio de sesión
            </button>
          </div>
          
          <div style={{...styles.backLink, marginTop: '8px'}}>
            <button 
              onClick={() => window.location.href = '/forgot-password'} 
              style={styles.link}
            >
              Solicitar nuevo enlace de recuperación
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de reset (token válido)
  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Restablecer Contraseña</h2>
          <p style={styles.subtitle}>
            Ingrese su nueva contraseña para acceder al sistema
          </p>
        </div>

        {(userEmail || userName) && (
          <div style={styles.userInfo}>
            <strong>Usuario:</strong> {userName || userEmail}
            {userName && userEmail && (
              <>
                <br />
                <strong>Email:</strong> {userEmail}
              </>
            )}
          </div>
        )}

        <div>
          <div style={styles.formGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit(e)}
              style={{...styles.input, ...styles.passwordInput}}
              disabled={isLoading}
              maxLength={50}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            <span 
              style={styles.eyeIcon}
              onClick={() => togglePasswordVisibility('password')}
            >
              {showPassword ? <EyeClosedIcon size={20} /> : <EyeOpenIcon size={20} />}
            </span>
            
            {newPassword && (
              <div style={styles.strengthMeter}>
                <div style={styles.strengthBar}>
                  <div 
                    style={{
                      ...styles.strengthFill,
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: strengthInfo.color
                    }}
                  />
                </div>
                <div style={{...styles.strengthText, color: strengthInfo.color}}>
                  Seguridad: {strengthInfo.text}
                </div>
              </div>
            )}
            
            <div style={styles.requirements}>
              Debe contener: mayúscula, minúscula, número (mínimo 6 caracteres)
            </div>
          </div>

          <div style={styles.formGroup}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit(e)}
              style={{...styles.input, ...styles.passwordInput}}
              disabled={isLoading}
              maxLength={50}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            <span 
              style={styles.eyeIcon}
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {showConfirmPassword ? <EyeClosedIcon size={20} /> : <EyeOpenIcon size={20} />}
            </span>
          </div>

          {confirmPassword && newPassword && (
            <div style={{
              ...styles.alert, 
              ...(newPassword === confirmPassword ? styles.alertSuccess : styles.alertWarning),
              marginBottom: '16px'
            }}>
              {newPassword === confirmPassword ? 
                '✅ Las contraseñas coinciden' : 
                '⚠️ Las contraseñas no coinciden'
              }
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            style={{
              ...styles.button,
              ...(isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword ? styles.buttonDisabled : {})
            }}
          >
            {isLoading && <span style={styles.loadingSpinner}></span>}
            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
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
          <button onClick={handleBackToLogin} style={styles.link}>
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;