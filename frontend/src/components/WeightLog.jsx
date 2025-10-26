import React, { useState } from 'react';
import { logWeight } from '../services/api';
import UnitSwitch from './UnitSwitch';

function WeightLog({ onWeightLogged }) {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

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
      await logWeight({ weight: weightInKg, log_date: logDate });
      setWeight('');
      setLogDate(new Date().toISOString().split('T')[0]);
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
        <label htmlFor="weightDate" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Date:
        </label>
        <input
          type="date"
          id="weightDate"
          value={logDate}
          onChange={(e) => setLogDate(e.target.value)}
          style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
          required
        />
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