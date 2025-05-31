// src/pages/ControlFormPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { fetchLineas, fetchSpecs, sendData } from '../services/api';

const ControlFormPage = ({ userEmail, userName, onLogout }) => {
  const [linea, setLinea] = useState('');
  const [tipoControl, setTipoControl] = useState('');
  const [specs, setSpecs] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [lineasDisponibles, setLineasDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSpecs, setIsLoadingSpecs] = useState(false);
  const [isLoadingLineas, setIsLoadingLineas] = useState(false);
  const [ciclos, setCiclos] = useState({});
  const [segundos, setSegundos] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLineasData();
  }, []);

  useEffect(() => {
    if (linea && tipoControl) {
      fetchSpecsData();
    }
  }, [linea, tipoControl]);

  const fetchLineasData = async () => {
    try {
      setIsLoadingLineas(true);
      const lineas = await fetchLineas();
      setLineasDisponibles(lineas);
    } catch (error) {
      setError('Error cargando líneas: ' + error.message);
    } finally {
      setIsLoadingLineas(false);
    }
  };

  const fetchSpecsData = async () => {
    try {
      setIsLoadingSpecs(true);
      const specsData = await fetchSpecs(linea, tipoControl);
      setSpecs(specsData);
      setRespuestas(specsData.map(() => ''));
      
      const nuevoCiclos = {};
      const nuevoSegundos = {};
      specsData.forEach((_, index) => {
        nuevoCiclos[index] = '';
        nuevoSegundos[index] = '';
      });
      setCiclos(nuevoCiclos);
      setSegundos(nuevoSegundos);
    } catch (error) {
      setError('Error cargando especificaciones: ' + error.message);
    } finally {
      setIsLoadingSpecs(false);
    }
  };

  const handleRespuesta = (index, value) => {
    const nuevas = [...respuestas];
    nuevas[index] = value;
    setRespuestas(nuevas);
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(Number(num))) {
      return '0';
    }
    return Number(num).toFixed(2);
  };

  const validarDatos = () => {
    const hayRespuestasVacias = specs.some((_, i) => !respuestas[i]);
    
    if (tipoControl === 'Prensa') {
      const hayPuestosSinCiclos = specs.some((spec, i) => 
        spec.Ciclos && spec.Ciclos > 0 && !ciclos[i]);
        
      if (hayPuestosSinCiclos) {
        setError('Por favor complete los ciclos para todos los puestos necesarios');
        return false;
      }
    }
    
    if (hayRespuestasVacias) {
      setError('Por favor complete todos los valores');
      return false;
    }
    
    return true;
  };

  const enviar = async () => {
    setError('');
    setSuccess('');
    
    if (!validarDatos()) {
      return;
    }
    
    if (!linea) {
      setError('Por favor seleccione una línea');
      return;
    }
    
    let datos = [];
    
    if (tipoControl === 'Prensa') {
      specs.forEach((spec, i) => {
        const resultado = respuestas[i];
        const segundosValue = segundos[i] || '';
        const timestamp = Date.now();
        
        if (resultado) {
          datos.push({
            ID: timestamp.toString() + '_p_' + i,
            Fecha: new Date().toLocaleString(),
            Usuario: userEmail,
            TipoControl: tipoControl,
            Linea: linea.toString().trim(),
            Puesto: spec.Puesto,
            Fixture: spec.Fixture || '',
            Resultado: resultado,
            Min: spec.Min || '',
            Max: spec.Max || '',
          });
        }
        
        if (segundosValue) {
          datos.push({
            ID: timestamp.toString() + '_s_' + i,
            Fecha: new Date().toLocaleString(),
            Usuario: userEmail,
            TipoControl: tipoControl,
            Linea: linea.toString().trim(),
            Puesto: spec.Puesto,
            Fixture: `${spec.Fixture || ''}.Segundos`,
            Resultado: segundosValue,
            Min: spec.Min_Seg || '',
            Max: spec.Max_Seg || '',
          });
        }
      });
    } else {
      datos = specs.map((spec, i) => {
        const resultado = respuestas[i];
        return {
          ID: Date.now().toString() + i,
          Fecha: new Date().toLocaleString(),
          Usuario: userEmail,
          TipoControl: tipoControl,
          Linea: linea.toString().trim(),
          Puesto: spec.Puesto,
          Fixture: spec.Fixture || '',
          Resultado: resultado,
          Min: spec.Min || '',
          Max: spec.Max || '',
        };
      }).filter(d => d.Resultado && d.Resultado !== '');
    }
    
    if (datos.length === 0) {
      setError('No hay datos para enviar');
      return;
    }
    
    try {
      setIsLoading(true);
      await sendData({ data: datos });
      setSuccess(`✅ Datos enviados correctamente. Se enviaron ${datos.length} registros`);
      
      // Limpiar formulario
      setSpecs([]);
      setRespuestas([]);
      setLinea('');
      setTipoControl('');
      setCiclos({});
      setSegundos({});
    } catch (error) {
      setError('❌ Error al enviar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/* Header */}
      <div className="header-section">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img
              src="/assets/Logo_Negro_1.png"
              alt="Newsan Logo"
              className="header-logo me-3"
            />
            <h1 className="mb-0">Controles Diarios</h1>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-3">Usuario: <Badge bg="secondary">{userName}</Badge></span>
            <Button variant="outline-secondary" onClick={onLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Formulario principal */}
      <Row>
        <Col lg={4} md={5}>
          <Card className="config-card">
            <Card.Body>
              <h5>Configuración</h5>
              
              <Form.Group className="mb-3">
                <Form.Label>Seleccionar Línea</Form.Label>
                {isLoadingLineas ? (
                  <div className="text-center p-3">
                    <Spinner animation="border" size="sm" />
                  </div>
                ) : (
                  <Form.Select value={linea} onChange={(e) => setLinea(e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {lineasDisponibles.map((l, idx) => (
                      <option key={idx} value={l}>{l}</option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Control</Form.Label>
                <Form.Select value={tipoControl} onChange={(e) => setTipoControl(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option value="Torque">Torque</option>
                  <option value="Pulsera">Pulsera</option>
                  <option value="Prensa">Prensa</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8} md={7}>
          {isLoadingSpecs && (
            <div className="text-center p-5">
              <Spinner animation="border" />
              <p className="mt-2">Cargando especificaciones...</p>
            </div>
          )}

          {specs.map((item, index) => (
            <Card key={index} className="spec-card">
              <Card.Body>
                <h6>{item.Puesto}</h6>
                
                {tipoControl === 'Prensa' && (
                  <p className="text-muted">
                    {item.Punto || ''} {item.Punto && item.Fixture ? '/' : ''} {item.Fixture || ''}
                  </p>
                )}
                
                {(item.Min && item.Max) && (
                  <p className="spec-text">Rango permitido: {formatNumber(item.Min)} - {formatNumber(item.Max)}</p>
                )}

                {/* Controles según tipo */}
                {tipoControl === 'Pulsera' && (
                  <div>
                    <Form.Label>Resultado:</Form.Label>
                    <div className="btn-group d-flex gap-1 mt-2" role="group">
                      {['OK', 'NG', 'TNG'].map(option => (
                        <div key={option}>
                          <input
                            type="radio"
                            className="btn-check"
                            name={`pulsera-${index}`}
                            id={`pulsera-${index}-${option}`}
                            checked={respuestas[index] === option}
                            onChange={() => handleRespuesta(index, option)}
                          />
                          <label 
                            className={`btn ${respuestas[index] === option ? 'btn-primary' : 'btn-outline-primary'}`}
                            htmlFor={`pulsera-${index}-${option}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tipoControl === 'Prensa' && (
                  <div>
                    <Form.Label>Resultado de presión:</Form.Label>
                    <div className="btn-group d-flex gap-1 mt-2 mb-3" role="group">
                      {['OK', 'NG'].map(option => (
                        <div key={option}>
                          <input
                            type="radio"
                            className="btn-check"
                            name={`prensa-${index}`}
                            id={`prensa-${index}-${option}`}
                            checked={respuestas[index] === option}
                            onChange={() => handleRespuesta(index, option)}
                          />
                          <label 
                            className={`btn ${respuestas[index] === option ? 'btn-primary' : 'btn-outline-primary'}`}
                            htmlFor={`prensa-${index}-${option}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {item.Ciclos && item.Ciclos > 0 && (
                      <Form.Group className="mb-3">
                        <Form.Label>Ciclos (ref: {item.Ciclos})</Form.Label>
                        <Form.Control
                          type="number"
                          value={ciclos[index] || ''}
                          onChange={(e) => setCiclos({...ciclos, [index]: e.target.value})}
                        />
                      </Form.Group>
                    )}
                    
                    <Form.Group>
                      <Form.Label>
                        Tiempo en segundos: {segundos[index] || '0'}s
                        {item.Min_Seg && item.Max_Seg && (
                          <span className="spec-text"> (Spec: {formatNumber(item.Min_Seg)}s - {formatNumber(item.Max_Seg)}s)</span>
                        )}
                      </Form.Label>
                      {item.Min_Seg && item.Max_Seg ? (
                        <>
                          <Form.Range
                            min={Number(item.Min_Seg) * 0.75}
                            max={Number(item.Max_Seg) * 1.25}
                            step={0.1}
                            value={segundos[index] || Number(item.Min_Seg)}
                            onChange={(e) => setSegundos({...segundos, [index]: e.target.value})}
                          />
                          <div className="d-flex justify-content-between small text-muted">
                            <span>{(Number(item.Min_Seg) * 0.75).toFixed(1)}s</span>
                            <span>{(Number(item.Max_Seg) * 1.25).toFixed(1)}s</span>
                          </div>
                        </>
                      ) : (
                        <Form.Control
                          type="number"
                          step="0.1"
                          value={segundos[index] || ''}
                          onChange={(e) => setSegundos({...segundos, [index]: e.target.value})}
                        />
                      )}
                    </Form.Group>
                  </div>
                )}

                {tipoControl === 'Torque' && (
                  <Form.Group>
                    <Form.Label>
                      Valor: {respuestas[index] || '0'}
                      {item.Min && item.Max && (
                        <span className="spec-text"> (Spec: {formatNumber(item.Min)} - {formatNumber(item.Max)})</span>
                      )}
                    </Form.Label>
                    {item.Min && item.Max ? (
                      <>
                        <Form.Range
                          min={Number(item.Min) * 0.75}
                          max={Number(item.Max) * 1.25}
                          step={0.01}
                          value={respuestas[index] || Number(item.Min)}
                          onChange={(e) => handleRespuesta(index, e.target.value)}
                        />
                        <div className="d-flex justify-content-between small text-muted">
                          <span>{(Number(item.Min) * 0.75).toFixed(2)}</span>
                          <span>{(Number(item.Max) * 1.25).toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={respuestas[index] || ''}
                        onChange={(e) => handleRespuesta(index, e.target.value)}
                      />
                    )}
                  </Form.Group>
                )}
              </Card.Body>
            </Card>
          ))}

          {specs.length > 0 && (
            <div className="text-center mt-4">
              <Button 
                onClick={enviar} 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Datos'
                )}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ControlFormPage;