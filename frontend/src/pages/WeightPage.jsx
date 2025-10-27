import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Button, Chip, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { getWeightLogs, deleteWeightLog } from '../services/api';
import Modal from '../components/Modal';
import WeightLog from '../components/WeightLog';
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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
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

  const handleDeleteLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this weight entry?')) {
      try {
        await deleteWeightLog(logId);
        fetchLogs();
      } catch (error) {
        console.error('Failed to delete weight log', error);
        alert('Failed to delete entry.');
      }
    }
  }

  const latestWeightKg = logs[0]?.weight || 0;
  const displayWeight = unit === 'lbs' ? (latestWeightKg * 2.20462).toFixed(1) : latestWeightKg.toFixed(1);

  const chartData = {
    labels: [...logs].reverse().map(log => parseLocalDate(log.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: `Weight (${unit})`,
        data: [...logs].reverse().map(log => unit === 'lbs' ? log.weight * 2.20462 : log.weight),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };
  
  const chartOptions = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }
    },
    scales: { 
      x: { 
        grid: { display: false },
        ticks: { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', font: { size: 11 } }
      }, 
      y: { 
        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
        ticks: { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', font: { size: 11 } }
      } 
    }
  }), [isDark]);

  const handleUnitChange = (event, newUnit) => {
    if (newUnit !== null) {
      setUnit(newUnit);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 2.5,
        color: 'white',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)'
      }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>
            Latest Weigh-In
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            {logs.length > 0 ? displayWeight : 'N/A'} {unit}
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={unit}
          exclusive
          onChange={handleUnitChange}
          size="small"
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            '& .MuiToggleButton-root': {
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              flex: 1,
              '&.Mui-selected': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.4)',
                },
              },
            },
          }}
        >
          <ToggleButton value="lbs">lbs</ToggleButton>
          <ToggleButton value="kg">kg</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Button 
        fullWidth 
        variant="contained" 
        size="large"
        onClick={() => setIsModalOpen(true)}
        sx={{ 
          mb: 3,
          py: 1.5,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 600,
          textTransform: 'none'
        }}
      >
        Weigh In
      </Button>
      
      {logs.length > 1 ? (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ height: 250 }}>
              <Line options={chartOptions} data={chartData} />
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography align="center" color="text.secondary">
              Log your weight to see your progress chart.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Button 
        fullWidth 
        variant="outlined"
        onClick={() => setShowHistory(!showHistory)}
        sx={{ mb: 2 }}
      >
        {showHistory ? 'Hide' : 'Show'} Full History
      </Button>

      {showHistory && (
        <Box>
          {logs.map((log) => (
            <Card key={log.id} sx={{ mb: 1, borderRadius: 3, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <CardContent sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2
              }}>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {parseLocalDate(log.log_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(log.timestamp)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip 
                    label={`${unit === 'lbs' ? (log.weight * 2.20462).toFixed(1) : log.weight.toFixed(1)} ${unit}`}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteLog(log.id)}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'error.light',
                        color: 'white'
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Your Weight">
        <WeightLog onWeightLogged={handleWeightLogged} />
      </Modal>
    </Box>
  );
}
export default WeightPage;