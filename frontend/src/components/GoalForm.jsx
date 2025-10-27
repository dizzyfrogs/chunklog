import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  ToggleButton, 
  ToggleButtonGroup, 
  Typography, 
  Alert, 
  CircularProgress,
  Card
} from '@mui/material';
import { calculateGoal, setManualGoal, getWeightLogs } from '../services/api';

function GoalForm({ currentGoal, onGoalSet }) {
  const [mode, setMode] = useState('manual');
  const [hasWeightLogs, setHasWeightLogs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [goalType, setGoalType] = useState('weight_loss');
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
          setMode('automatic');
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
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {hasWeightLogs ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>Calculation Mode</Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, value) => value && setMode(value)}
            fullWidth
            sx={{ display: 'flex', gap: 0.5, '& .MuiToggleButton-root': { 
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600
            } }}
          >
            <ToggleButton value="automatic">Automatic</ToggleButton>
            <ToggleButton value="manual">Manual</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      ) : (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          Log your weight at least once to unlock automatic goal suggestions!
        </Alert>
      )}

      {mode === 'automatic' && hasWeightLogs ? (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Calculate your daily targets based on your profile and goal.
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Goal Template</InputLabel>
            <Select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              label="Goal Template"
            >
              <MenuItem value="maintenance">Maintain Weight</MenuItem>
              <MenuItem value="weight_loss">Lose Weight (~1 lb / week)</MenuItem>
              <MenuItem value="muscle_growth">Build Muscle (Lean Bulk)</MenuItem>
            </Select>
          </FormControl>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large"
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Calculate Targets
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manually set your own daily targets.
          </Typography>
          <TextField
            fullWidth
            type="number"
            name="target_calories"
            label="Calories"
            value={manualData.target_calories}
            onChange={handleManualChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            name="target_protein"
            label="Protein (g)"
            value={manualData.target_protein}
            onChange={handleManualChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            name="target_carbs"
            label="Carbs (g)"
            value={manualData.target_carbs}
            onChange={handleManualChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            name="target_fat"
            label="Fat (g)"
            value={manualData.target_fat}
            onChange={handleManualChange}
            sx={{ mb: 2 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large"
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Save Manual Goal
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default GoalForm;