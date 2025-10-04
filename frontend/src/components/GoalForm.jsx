import React, { useState, useEffect } from 'react';
import { calculateGoal, setManualGoal, getWeightLogs } from '../services/api';

const toggleButtonStyle = (isActive) => ({
  flex: 1,
  padding: '0.75rem',
  background: isActive ? 'var(--primary)' : 'var(--background)',
  color: isActive ? 'var(--background)' : 'var(--text-primary)',
  border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
});

function GoalForm({ currentGoal, onGoalSet }) {
  const [mode, setMode] = useState('manual'); // Default to manual
  const [hasWeightLogs, setHasWeightLogs] = useState(false);
  const [loading, setLoading] = useState(true);

  // State for automatic mode
  const [goalType, setGoalType] = useState('weight_loss');

  // State for manual mode
  const [manualData, setManualData] = useState({
    target_calories: currentGoal?.target_calories || '',
    target_protein: currentGoal?.target_protein || '',
    target_carbs: currentGoal?.target_carbs || '',
    target_fat: currentGoal?.target_fat || '',
  });

  useEffect(() => {
    const checkWeightLogs = async () => {
      setLoading(true);
      try {
        const response = await getWeightLogs();
        if (response.data.length > 0) {
          setHasWeightLogs(true);
          setMode('automatic'); // If they have logs, default to automatic
        }
      } catch (error) {
        console.error("Failed to check for weight logs", error);
      } finally {
        setLoading(false);
      }
    };
    checkWeightLogs();
  }, []);

  const handleManualChange = (e) => {
    setManualData({ ...manualData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (mode === 'automatic') {
        response = await calculateGoal({ goal_type: goalType });
      } else {
        const payload = Object.fromEntries(
          Object.entries(manualData).map(([key, value]) => [key, parseFloat(value) || 0])
        );
        response = await setManualGoal(payload);
      }
      alert('Goal updated successfully!');
      onGoalSet(response.data);
    } catch (error) {
      const detail = error.response?.data?.detail || 'An unknown error occurred.';
      console.error('Failed to update goal:', detail);
      alert(`Failed to update goal: ${detail}`);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {hasWeightLogs ? (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button type="button" style={toggleButtonStyle(mode === 'automatic')} onClick={() => setMode('automatic')}>
            Automatic
          </button>
          <button type="button" style={toggleButtonStyle(mode === 'manual')} onClick={() => setMode('manual')}>
            Manual
          </button>
        </div>
      ) : (
        // If no logs, show a helpful message instead of the toggle
        <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '4px', textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{color: 'var(--text-secondary)'}}>Log your weight at least once to unlock automatic goal suggestions!</p>
        </div>
      )}

      {mode === 'automatic' && hasWeightLogs ? (
        <>
          <p style={{color: 'var(--text-secondary)', textAlign: 'center'}}>Calculate your daily targets based on your profile and goal.</p>
          <div>
              <label>Select Your Goal Template:</label>
              <select value={goalType} onChange={(e) => setGoalType(e.target.value)}>
                  <option value="maintenance">Maintain Weight</option>
                  <option value="weight_loss">Lose Weight (~1 lb / week)</option>
                  <option value="muscle_growth">Build Muscle (Lean Bulk)</option>
              </select>
          </div>
          <button type="submit" style={{marginTop: '1rem'}}>Calculate Targets</button>
        </>
      ) : (
        <>
          <p style={{color: 'var(--text-secondary)', textAlign: 'center'}}>Manually set your own daily targets.</p>
          <div><label>Calories:</label><input type="number" name="target_calories" value={manualData.target_calories} onChange={handleManualChange} /></div>
          <div><label>Protein (g):</label><input type="number" name="target_protein" value={manualData.target_protein} onChange={handleManualChange} /></div>
          <div><label>Carbs (g):</label><input type="number" name="target_carbs" value={manualData.target_carbs} onChange={handleManualChange} /></div>
          <div><label>Fat (g):</label><input type="number" name="target_fat" value={manualData.target_fat} onChange={handleManualChange} /></div>
          <button type="submit" style={{marginTop: '1rem'}}>Save Manual Goal</button>
        </>
      )}
    </form>
  );
}

export default GoalForm;