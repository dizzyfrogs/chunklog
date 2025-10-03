import React, { useState } from 'react';
import { calculateGoal } from '../services/api';

function GoalForm({ onGoalSet }) {
  const [goalType, setGoalType] = useState('maintenance');
  const [currentWeight, setCurrentWeight] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentWeight) {
        alert('Please enter your current weight.');
        return;
    }
    try {
      const response = await calculateGoal({
        goal_type: goalType,
        current_weight_kg: parseFloat(currentWeight),
      });
      alert('Goal calculated and updated successfully!');
      onGoalSet(response.data);
    } catch (error) {
      console.error('Failed to calculate goal:', error.response?.data?.detail);
      alert(`Failed to calculate goal: ${error.response?.data?.detail}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Calculate Your Calorie Goal</h4>
      <p>This will use your profile data to recommend a daily calorie target.</p>
      
      <div>
        <label>Your Current Weight (in kg):</label>
        <input
          type="number"
          step="0.1"
          value={currentWeight}
          onChange={(e) => setCurrentWeight(e.target.value)}
          placeholder="e.g., 85.5"
          required
        />
      </div>

      <div>
        <label>Select Your Goal:</label>
        <select value={goalType} onChange={(e) => setGoalType(e.target.value)}>
          <option value="maintenance">Maintain Weight</option>
          <option value="weight_loss">Lose Weight (~1 lb/week)</option>
          <option value="muscle_growth">Build Muscle (Lean Bulk)</option>
        </select>
      </div>
      <button type="submit">Calculate and Set Goal</button>
    </form>
  );
}

export default GoalForm;