import React, { useState } from 'react';
import { TextField, Button, Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { logWeight } from '../services/api';

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function WeightLog({ onWeightLogged }) {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [logDate, setLogDate] = useState(formatLocalDate(new Date()));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) return;
    try {
      let weightInKg;
      if (weightUnit === 'lbs') {
        weightInKg = parseFloat(weight) / 2.20462;
      } else {
        weightInKg = parseFloat(weight);
      }
      await logWeight({ weight: weightInKg, log_date: logDate });
      setWeight('');
      setLogDate(formatLocalDate(new Date()));
      toast.success('Weight logged successfully!');
      if (onWeightLogged) onWeightLogged();
    } catch (error) {
      console.error("Failed to log weight", error);
      toast.error('Failed to log weight.');
    }
  };

  const handleUnitChange = (event, newUnit) => {
    if (newUnit !== null) {
      setWeightUnit(newUnit);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
        DATE
      </Typography>
      <TextField
        fullWidth
        type="date"
        value={logDate}
        onChange={(e) => setLogDate(e.target.value)}
        required
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />
      
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
        WEIGHT
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          type="number"
          step="0.1"
          label="Enter your weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>{weightUnit}</Box>
          }}
        />
        
        <ToggleButtonGroup
          value={weightUnit}
          exclusive
          onChange={handleUnitChange}
          sx={{ 
            display: 'flex',
            width: '100%',
            '& .MuiToggleButton-root': {
              flex: 1,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <ToggleButton value="lbs">Pounds (lbs)</ToggleButton>
          <ToggleButton value="kg">Kilograms (kg)</ToggleButton>
        </ToggleButtonGroup>
      </Box>
        
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
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
          },
        }}
      >
        Log Weight
      </Button>
    </Box>
  );
}

export default WeightLog;
