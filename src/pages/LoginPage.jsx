import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { getAuthorizedEmails } from '../services/authService';

// Lista temporal mientras carga los datos
const INITIAL_EMAILS = ['pablomartin.gatica@newsan.com.ar'];

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [allowedEmails, setAllowedEmails] = useState(INITIAL_EMAILS);
  const [isLoadingEmails, setIsLoadingEmails] = useState(true);

  // Cargar emails permitidos al iniciar
  useEffect(() => {
    const loadAuthorizedEmails = async () => {
      try {
        const emails = await getAuthorizedEmails();
        setAllowedEmails(emails);
      } catch (error) {
        console.error('Error cargando emails autorizados:', error);
      } finally {
        setIsLoadingEmails(false);
      }
    };

    loadAuthorizedEmails();
  }, []);

  const validateEmail = (email) => {
    // Verificar formato básico de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Verificar que el dominio sea newsan.com.ar
    const domain = email.split('@')[1];
    if (domain !== 'newsan.com.ar') {
      return false;
    }
    
    // Verificar si está en la lista de permitidos
    return allowedEmails.includes(email.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }

    if (isLoadingEmails) {
      setError('El sistema está cargando la lista de usuarios autorizados. Por favor, espere un momento.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulamos un pequeño retraso como en un login real
    setTimeout(() => {
      if (validateEmail(email)) {
        const userName = email.split('@')[0]; // Extrae el nombre del correo
        onLogin(email, userName);
      } else {
        setError('No tiene autorización para acceder a esta aplicación');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="/assets/Logo_Negro_1.png"
          alt="Newsan Logo"
          className="login-logo"
        />
        
        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">Usar tu cuenta de Newsan</p>
        
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {isLoadingEmails && <Alert variant="info" className="mb-3">Cargando usuarios autorizados...</Alert>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="login-input w-100"
            required
          />
          
          <button
            type="submit"
            disabled={isLoading || isLoadingEmails}
            className="login-button w-100"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;