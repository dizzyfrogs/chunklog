import React, { useState } from 'react';
import { logWeight } from '../services/api';

function WeightLog({ onWeightLogged }) {
  const [weight, setWeight] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) return;
    try {
      await logWeight({ weight: parseFloat(weight) });
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
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter your weight in kg"
          required
        />
        <button type="submit">Log Weight</button>
      </form>
    </div>
  );
}

export default WeightLog;