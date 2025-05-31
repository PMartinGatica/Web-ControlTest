// src/components/Welcome.jsx
import { Container, Button, Image } from 'react-bootstrap';

function Welcome({ userName, onContinue }) {
  return (
    <Container className="text-center my-5">
      <div className="py-5">
        <Image 
          src="/assets/Logo_Negro_1.png"
          alt="Newsan Logo"
          style={{ width: '200px' }}
          className="mb-4"
        />
        
        <h1 className="display-4 mb-3">¡Bienvenido!</h1>
        <h2 className="mb-4 text-muted">{userName}</h2>
        
        <Button 
          variant="dark" 
          size="lg"
          onClick={onContinue}
        >
          Continuar a la aplicación
        </Button>
      </div>
    </Container>
  );
}

export default Welcome;