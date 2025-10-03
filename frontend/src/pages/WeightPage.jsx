import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getWeightLogs } from '../services/api';
import Modal from '../components/Modal';
import WeightLog from '../components/WeightLog';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function WeightPage() {
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchLogs = async () => {
    try {
      const response = await getWeightLogs();
      const sortedLogs = response.data.sort((a, b) => new Date(b.log_date) - new Date(a.log_date));
      setLogs(sortedLogs);
    } catch (error) {
      console.error("Failed to fetch weight logs", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);
  
  const handleWeightLogged = () => {
    setIsModalOpen(false);
    fetchLogs();
  }

  const chartData = {
    labels: [...logs].reverse().map(log => parseLocalDate(log.log_date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: [...logs].reverse().map(log => log.weight),
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(97, 218, 251, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Weight Tracker</h2>
        <button onClick={() => setIsModalOpen(true)}>Log Weight</button>
      </div>
      <hr />
      
      {logs.length > 1 ? (
        <Line data={chartData} />
      ) : (
        <p>Log at least two weight entries to see your progress chart.</p>
      )}

      <hr />
      <button onClick={() => setShowHistory(!showHistory)} className="link-button" style={{fontSize: '1rem'}}>
        {showHistory ? 'Hide' : 'Show'} Full History
      </button>

      {showHistory && (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {logs.map((log) => (
            <li key={log.id} style={{ background: 'var(--background)', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
              {parseLocalDate(log.log_date).toLocaleDateString()}: <strong>{log.weight} kg</strong>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Your Weight">
        <WeightLog onWeightLogged={handleWeightLogged} />
      </Modal>
    </div>
  );
}
export default WeightPage;