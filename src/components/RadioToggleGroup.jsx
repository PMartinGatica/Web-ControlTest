// src/components/RadioToggleGroup.jsx
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

function RadioToggleGroup({ options, selectedValue, onValueChange, name }) {
  return (
    <ButtonGroup className="w-100 mb-3">
      {options.map((option, idx) => (
        <ToggleButton
          key={idx}
          id={`radio-${name}-${idx}`}
          type="radio"
          variant={selectedValue === option.value ? 'primary' : 'outline-primary'}
          name={name}
          value={option.value}
          checked={selectedValue === option.value}
          onChange={() => onValueChange(option.value)}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
}

export default RadioToggleGroup;