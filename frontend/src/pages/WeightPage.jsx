import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { getWeightLogs } from '../services/api';
import Modal from '../components/Modal';
import WeightLog from '../components/WeightLog';
import UnitSwitch from '../components/UnitSwitch';
import PageHeader from '../components/PageHeader';
import '../styles/WeightPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

const formatTime = (unixTimestamp) => {
    if (!unixTimestamp) return '';
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

function WeightPage() {
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [unit, setUnit] = useState('lbs');

  const fetchLogs = async () => {
    try {
      const response = await getWeightLogs();
      setLogs(response.data);
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

  const latestWeightKg = logs[0]?.weight || 0;
  const displayWeight = unit === 'lbs' ? (latestWeightKg * 2.20462).toFixed(1) : latestWeightKg.toFixed(1);

  const chartData = {
    labels: [...logs].reverse().map(log => parseLocalDate(log.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: `Weight (${unit})`,
        data: [...logs].reverse().map(log => unit === 'lbs' ? log.weight * 2.20462 : log.weight),
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(97, 218, 251, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
  
  const chartOptions = {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { color: 'rgba(255,255,255,0.1)' } }, y: { grid: { color: 'rgba(255,255,251,0.1)' } } }
  };

  return (
    <div>
      <PageHeader title="Weight Tracker" />
      <hr />

      <div className="latest-weight-card">
        <div className="label">Latest Weigh-In</div>
        <div className="value">{logs.length > 0 ? displayWeight : 'N/A'} {unit}</div>
        <div className="unit-toggle">
          <UnitSwitch unit={unit} setUnit={setUnit} options={['lbs', 'kg']} />
        </div>
      </div>

      <button className="log-weight-btn" onClick={() => setIsModalOpen(true)}>Weigh In</button>
      
      {logs.length > 1 ? (
        <div style={{marginTop: '1.5rem'}}>
          <Line options={chartOptions} data={chartData} />
        </div>
      ) : (
        <p style={{textAlign: 'center', margin: '2rem 0', color: 'var(--text-secondary)'}}>
            Log your weight to see your progress chart.
        </p>
      )}

      <hr />
      <button onClick={() => setShowHistory(!showHistory)} className="link-button" style={{fontSize: '1rem'}}>
        {showHistory ? 'Hide' : 'Show'} Full History
      </button>

      {showHistory && (
        <div style={{ marginTop: '1rem' }}>
          {logs.map((log) => (
            <div key={log.id} className="history-item">
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span className="date">{parseLocalDate(log.log_date).toLocaleDateString()}</span>
                <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{formatTime(log.timestamp)}</span>
              </div>
              <strong>{unit === 'lbs' ? (log.weight * 2.20462).toFixed(1) : log.weight.toFixed(1)} {unit}</strong>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Your Weight">
        <WeightLog onWeightLogged={handleWeightLogged} />
      </Modal>
    </div>
  );
}
export default WeightPage;