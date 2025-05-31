// src/components/RangeSlider.jsx
import { Form, Row, Col } from 'react-bootstrap';

function RangeSlider({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 0.01,
  showCurrentValue = true,
  formatValue = (val) => Number(val).toFixed(2)
}) {
  return (
    <div>
      {showCurrentValue && (
        <div className="text-center mb-2">
          Valor actual: {formatValue(value)}
        </div>
      )}
      
      <Form.Range
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
      
      <Row className="mt-1">
        <Col xs={6} className="text-start">
          {formatValue(min)}
        </Col>
        <Col xs={6} className="text-end">
          {formatValue(max)}
        </Col>
      </Row>
    </div>
  );
}

export default RangeSlider;