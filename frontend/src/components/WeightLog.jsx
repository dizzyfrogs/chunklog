import React, { useState, useEffect } from 'react';
import { getWeightLogs, logWeight } from '../services/api';

function WeightLog() {
  const [weight, setWeight] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await getWeightLogs();
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch weight logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) return;
    try {
      await logWeight({ weight: parseFloat(weight) });
      setWeight('');
      fetchLogs(); 
      alert('Weight logged successfully!');
    } catch (error) {
      console.error("Failed to log weight", error);
      alert('Failed to log weight.');
    }
  };

  return (
    <div>
      <h4>Log Your Weight</h4>
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

      <h4>Weight History</h4>
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              {new Date(log.log_date).toLocaleDateString()}: {log.weight} kg
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WeightLog;