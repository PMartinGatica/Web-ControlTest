import React from 'react';

const WelcomePage = ({ userName, onContinue }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <img
          src="/assets/Logo_Negro_1.png"
          alt="Newsan Logo"
          className="welcome-logo"
        />
        
        <h1 className="welcome-title">¡Bienvenido!</h1>
        <h2 className="welcome-name">{userName}</h2>
        
        <button
          onClick={onContinue}
          className="welcome-button"
        >
          Continuar a la aplicación
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;