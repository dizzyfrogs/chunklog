import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Button, Chip } from '@mui/material';
import { ChevronLeft, ChevronRight, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import LogMealModal from '../components/LogMealModal';
import FoodForm from '../components/FoodForm';
import { getFoodLogs, deleteFoodLog } from '../services/api';
import '../styles/FoodPage.css';

const formatTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const groupMeals = (logs) => {
    const groups = { Morning: [], Afternoon: [], Evening: [] };
    logs.forEach(log => {
        const hour = new Date(log.timestamp * 1000).getHours();
        if (hour < 12) {
            groups.Morning.push(log);
        } else if (hour < 17) {
            groups.Afternoon.push(log);
        } else {
            groups.Evening.push(log);
        }
    });
    return groups;
};

function FoodPage() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dailyLog, setDailyLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const toYYYYMMDD = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  const fetchLogForDate = async (date) => {
    setLoading(true);
    try {
      const dateString = toYYYYMMDD(date);
      console.log('Fetching logs for date:', date, 'formatted as:', dateString);
      const response = await getFoodLogs(dateString);
      console.log('Received logs:', response.data);
      setDailyLog(response.data);
    } catch (error) {
      console.error(`Failed to fetch log for ${toYYYYMMDD(date)}`, error);
      setDailyLog([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogForDate(currentDate);
  }, [currentDate]);

  const handleMealLogged = async () => {
    console.log('handleMealLogged called');
    setIsLogModalOpen(false);
    // Wait a bit for the modal to close, then refresh
    setTimeout(async () => {
      console.log('Refreshing log for date:', currentDate);
      await fetchLogForDate(currentDate);
    }, 300);
  };

  const handleDeleteLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteFoodLog(logId);
        fetchLogForDate(currentDate);
      } catch (error) {
        console.error('Failed to delete food log', error);
        toast.error('Failed to delete entry.');
      }
    }
  };

  const goToPreviousDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const goToNextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const totalCalories = dailyLog.reduce((sum, item) => {
    const itemCalories = item.food ? item.food.calories * item.servings : 0;
    return sum + itemCalories;
  }, 0);

  const mealGroups = groupMeals(dailyLog);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 2.5,
        color: 'white',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={goToPreviousDay} size="small" sx={{ color: 'white' }}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            {currentDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
          </Typography>
          <IconButton onClick={goToNextDay} size="small" sx={{ color: 'white' }}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>
            Total Calories
          </Typography>
          <Typography variant="h5" fontWeight={700}>{Math.round(totalCalories)}</Typography>
        </Box>
      </Box>
      
      <Button 
        fullWidth 
        variant="contained" 
        size="large"
        onClick={() => setIsLogModalOpen(true)}
        sx={{ 
          mb: 3,
          py: 1.5,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 600,
          textTransform: 'none'
        }}
      >
        Log Meal
      </Button>

      {loading ? (
        <Typography>Loading log...</Typography>
      ) : (
        <Box>
          {Object.entries(mealGroups).map(([groupName, logs]) => (
            logs.length > 0 && (
              <Card key={groupName} sx={{ 
                mb: 2,
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)'
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ 
                    mb: 2, 
                    fontWeight: 700,
                    color: 'primary.main',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 1
                  }}>
                    {groupName}
                  </Typography>
                  {logs.map((log, index) => (
                    <Box
                      key={log.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1.5,
                        borderBottom: index < logs.length - 1 ? 1 : 0,
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                          {log.food.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {log.servings} serving{log.servings > 1 ? 's' : ''} &bull; {formatTime(log.timestamp)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip 
                          label={`${Math.round(log.food.calories * log.servings)} kcal`}
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
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )
          ))}
          {!loading && dailyLog.length === 0 && (
            <Card sx={{ mt: 3, borderRadius: 3 }}>
              <CardContent sx={{ p: 5, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No meals logged for this day.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log a Meal">
        <LogMealModal onMealLogged={handleMealLogged} selectedDate={currentDate} />
      </Modal>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add to Food Library">
        <FoodForm onFoodAdded={() => setIsAddModalOpen(false)} />
      </Modal>
    </Box>
  );
}

export default FoodPage;