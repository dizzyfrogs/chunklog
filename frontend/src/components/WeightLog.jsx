import React, { useState } from 'react';
import { logWeight } from '../services/api';
import UnitSwitch from './UnitSwitch';

function WeightLog({ onWeightLogged }) {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) return;
    try {
      let weightInKg;
      if (weightUnit === 'lbs') {
        weightInKg = parseFloat(weight) / 2.20462;
      } else {
        weightInKg = parseFloat(weight);
      }
      const today = new Date().toISOString().split('T')[0];
      await logWeight({ weight: weightInKg, log_date: today });
      setWeight('');
      alert('Weight logged successfully!');
      if (onWeightLogged) onWeightLogged();
    } catch (error) {
      console.error("Failed to log weight", error);
      alert('Failed to log weight.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Log a new weight entry</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            style={{ flex: 2 }}
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={`Weight in ${weightUnit}`}
            required
          />
          <UnitSwitch unit={weightUnit} setUnit={setWeightUnit} options={['lbs', 'kg']} />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Log Weight</button>
      </form>
    </div>
  );
}

export default WeightLog;