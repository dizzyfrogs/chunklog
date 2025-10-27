import React, { useState } from 'react';
import { TextField, Button, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
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
      <TextField
        fullWidth
        type="date"
        label="Date"
        value={logDate}
        onChange={(e) => setLogDate(e.target.value)}
        required
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />
      
      <TextField
        fullWidth
        type="number"
        step="0.1"
        label="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder={`Weight in ${weightUnit}`}
        required
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={weightUnit}
          exclusive
          onChange={handleUnitChange}
          fullWidth
          sx={{ display: 'flex', gap: 0.5, '& .MuiToggleButton-root': { 
            flex: 1,
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600
          } }}
        >
          <ToggleButton value="lbs">lbs</ToggleButton>
          <ToggleButton value="kg">kg</ToggleButton>
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
          textTransform: 'none'
        }}
      >
        Log Weight
      </Button>
    </Box>
  );
}

export default WeightLog;