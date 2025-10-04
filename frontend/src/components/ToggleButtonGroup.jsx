import React from 'react';

function ToggleButtonGroup({ options, selectedValue, onSelect }) {
  return (
    <div className="button-group-container">
      {options.map(option => (
        <button
          type="button"
          key={option.value}
          className={`option-button ${selectedValue === option.value ? 'active' : ''}`}
          onClick={() => onSelect(option.value)}
        >
          {option.icon && <div className="icon">{option.icon}</div>}
          <div className="title">{option.title}</div>
          {option.subtitle && <div className="subtitle">{option.subtitle}</div>}
        </button>
      ))}
    </div>
  );
}

export default ToggleButtonGroup;