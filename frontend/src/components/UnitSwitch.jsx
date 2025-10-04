import React from 'react';

const switchStyle = {
  display: 'flex',
  border: '1px solid var(--border)',
  borderRadius: '20px',
  overflow: 'hidden',
  width: 'fit-content',
};

const buttonStyle = (isActive) => ({
  padding: '0.25rem 0.75rem',
  background: isActive ? 'var(--primary)' : 'transparent',
  color: isActive ? 'var(--background)' : 'var(--text-secondary)',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
});

function UnitSwitch({ unit, setUnit, options }) {
  return (
    <div style={switchStyle}>
      <button type="button" style={buttonStyle(unit === options[0])} onClick={() => setUnit(options[0])}>
        {options[0]}
      </button>
      <button type="button" style={buttonStyle(unit === options[1])} onClick={() => setUnit(options[1])}>
        {options[1]}
      </button>
    </div>
  );
}

export default UnitSwitch;