import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Box, Card, CardContent, Typography, IconButton, LinearProgress, useTheme } from '@mui/material';
import { Settings, Restaurant } from '@mui/icons-material';
import { getUserGoal, getFoodLogs } from '../services/api';
import Modal from '../components/Modal';
import GoalForm from '../components/GoalForm';
import '../styles/Dashboard.css';

const MacroTracker = ({ label, consumed, goal, color }) => {
  const percent = goal > 0 ? (consumed / goal) * 100 : 0;
  return (
    <Box sx={{ 
      flex: 1,
      p: 1.5,
      borderRadius: 2,
      bgcolor: 'action.hover'
    }}>
      <Typography variant="caption" align="center" display="block" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" align="center" fontWeight={700} sx={{ mb: 1 }}>
        {Math.round(consumed)} <span style={{ opacity: 0.5 }}>/ {goal}g</span>
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={Math.min(percent, 100)} 
        sx={{ 
          height: 6, 
          borderRadius: 3, 
          bgcolor: 'action.disabled',
          '& .MuiLinearProgress-bar': {
            bgcolor: color,
            borderRadius: 3,
          }
        }} 
      />
    </Box>
  );
};

function DashboardPage() {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [goal, setGoal] = useState(null);
  const [dailyLog, setDailyLog] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    try {
      const today = getTodayString();
      const [goalResponse, logResponse] = await Promise.all([
        getUserGoal(),
        getFoodLogs(today)
      ]);
      setGoal(goalResponse.data);
      setDailyLog(logResponse.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      if (err.response && err.response.status === 404 && err.config.url.includes('/goals')) {
        setIsModalOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoalSet = (newGoal) => {
    setGoal(newGoal);
    setIsModalOpen(false);
  };

  const consumed = dailyLog.reduce((totals, item) => {
    if (item.food) {
      totals.calories += item.food.calories * item.servings;
      totals.protein += item.food.protein * item.servings;
      totals.carbs += item.food.carbs * item.servings;
      totals.fat += item.food.fat * item.servings;
    }
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  const budget = {
    calories: goal ? goal.target_calories : 0,
    protein: goal ? goal.target_protein : 0,
    carbs: goal ? goal.target_carbs : 0,
    fat: goal ? goal.target_fat : 0,
  };

  const remainingCalories = budget.calories - consumed.calories;
  const progressPercent = budget.calories > 0 ? (consumed.calories / budget.calories) * 100 : 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 2.5,
        color: 'white',
        boxShadow: mode === 'dark' ? '0 4px 20px rgba(99, 102, 241, 0.3)' : '0 4px 20px rgba(99, 102, 241, 0.2)'
      }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>Today's Progress</Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>Track your nutrition goals</Typography>
        </Box>
        <IconButton 
          onClick={() => setIsModalOpen(true)} 
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
            color: 'white'
          }}
        >
          <Settings />
        </IconButton>
      </Box>

      {/* Calorie Progress Card */}
      <Card sx={{ 
        mb: 2.5,
        borderRadius: 3,
        boxShadow: mode === 'dark' 
          ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          : '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* Circular Progress */}
          <Box sx={{ position: 'relative', width: '45%', maxWidth: 140, mx: 'auto', mb: 3 }}>
            <CircularProgressbar
              value={progressPercent}
              styles={buildStyles({
                pathColor: progressPercent > 100 ? '#fbbf24' : '#667eea',
                trailColor: mode === 'dark' ? '#334155' : '#e0e0e0',
                strokeLinecap: 'round',
                strokeWidth: 8,
              })}
            />
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              textAlign: 'center' 
            }}>
              <Typography variant="h4" fontWeight={700}>{Math.round(remainingCalories)}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                Remaining
              </Typography>
            </Box>
          </Box>
          
          {/* Calorie Summary */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            mb: 3,
            p: 2,
            borderRadius: 2.5,
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
            border: mode === 'dark' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(99, 102, 241, 0.15)'
          }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="caption" sx={{ 
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)', 
                fontWeight: 500,
                mb: 0.5,
                display: 'block'
              }}>
                Goal
              </Typography>
              <Typography variant="h5" fontWeight={700}>{budget.calories}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="caption" sx={{ 
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)', 
                fontWeight: 500,
                mb: 0.5,
                display: 'block'
              }}>
                Consumed
              </Typography>
              <Typography variant="h5" fontWeight={700}>{Math.round(consumed.calories)}</Typography>
            </Box>
          </Box>

          {/* Macros */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <MacroTracker label="Protein" consumed={consumed.protein} goal={budget.protein} color="#ec4899" />
            <MacroTracker label="Carbs" consumed={consumed.carbs} goal={budget.carbs} color="#6366f1" />
            <MacroTracker label="Fat" consumed={consumed.fat} goal={budget.fat} color="#fbbf24" />
          </Box>
        </CardContent>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Your Goal">
        <GoalForm currentGoal={goal} onGoalSet={handleGoalSet} />
      </Modal>
    </Box>
  );
}

export default DashboardPage;