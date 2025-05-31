import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import ControlFormPage from './pages/ControlFormPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  const handleLogin = (email, name) => {
    setUserEmail(email);
    setUserName(name);
    setShowWelcome(true);
    setIsAuthenticated(true);
  };

  const handleContinue = () => {
    setShowWelcome(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          !isAuthenticated ? <LoginPage onLogin={handleLogin} /> :
          showWelcome ? <WelcomePage userName={userName} onContinue={handleContinue} /> :
          <ControlFormPage userEmail={userEmail} userName={userName} onLogout={handleLogout} />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;