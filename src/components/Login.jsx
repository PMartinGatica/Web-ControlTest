// src/components/Login.jsx
import { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Image } from 'react-bootstrap';

const ALLOWED_EMAILS = [
  'adriana.venialgo@newsan.com.ar',
  'romina.morales@newsan.com.ar',
  // ... añadir todos los emails permitidos
];

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const domain = email.split('@')[1];
    if (domain !== 'newsan.com.ar') return false;
    return ALLOWED_EMAILS.includes(email.toLowerCase()) || true; // Quitar || true en producción
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (validateEmail(email)) {
        const userName = email.split('@')[0];
        onLogin(email, userName);
      } else {
        setError('No tiene autorización para acceder a esta aplicación');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4} className="text-center">
          <Image 
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
            alt="Google Logo"
            className="mb-4"
            height="50"
          />
          
          <h2 className="mb-3">Iniciar sesión</h2>
          <p className="text-muted mb-4">Usar tu cuenta de Newsan</p>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;