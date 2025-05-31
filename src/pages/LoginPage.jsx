import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

// Lista de correos electrónicos permitidos
const ALLOWED_EMAILS = [
  'adriana.venialgo@newsan.com.ar',
  'romina.morales@newsan.com.ar',
  'joaquin.acevedo@newsan.com.ar',
  'rocio.gamiz@newsan.com.ar',
  'lucia.castronuevo@newsan.com.ar',
  'azul.gon@newsan.com.ar',
  'guadalupe.cabana@newsan.com.ar',
  'paulacecilia.galvan@newsan.com.ar',
  'lucas.ruiz@newsan.com.ar',
  'maximiliano.vargas@newsan.com.ar',
  'ester.gago@newsan.com.ar',
  'brisa.caballero@newsan.com.ar',
  'daniel.maidana@newsan.com.ar',
  'mairaalejandra.morales@newsan.com.ar',
  'alisondenise.mendez@newsan.com.ar',
  'reneorlando.maldonado@newsan.com.ar',
  'bella.quinteros@newsan.com.ar',
  'maria.figueroa@newsan.com.ar',
  'mayra.tapia@newsan.com.ar',
  'mario.barrios@newsan.com.ar',
  'elias.esperguen@newsan.com.ar',
  'samuel.molina@newsan.com.ar',
  'facundomatias.tisera@newsan.com.ar',
  'ailin.chavarria@newsan.com.ar',
  'maria.requena@newsan.com.ar',
  'teresita.flores@newsan.com.ar',
  'fiorela.faydella@newsan.com.ar',
  'carlos.ramos@newsan.com.ar',
  'luismiguel.dimatteo@newsan.com.ar',
  'ruthevelin.gomez@newsan.com.ar',
  'sebastian.orellano@newsan.com.ar',
  'brian.moreyra@newsan.com.ar',
  'cristian.ramirez@newsan.com.ar',
  'pablomartin.gatica@newsan.com.ar'
];

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    return ALLOWED_EMAILS.includes(email.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor ingrese su correo electrónico');
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
            disabled={isLoading}
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