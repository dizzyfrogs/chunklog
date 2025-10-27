import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { createFood } from '../services/api';

function FoodForm({ onFoodAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const foodData = {
        name: formData.name,
        calories: parseFloat(formData.calories),
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fat: parseFloat(formData.fat) || 0,
      };
      await createFood(foodData);
      toast.success(`${formData.name} added to your food library!`);
      setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      if (onFoodAdded) onFoodAdded();
    } catch (error) {
      console.error('Failed to create food:', error);
      toast.error('Failed to add food.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.secondary' }}>
        REQUIRED
      </Typography>
      
      <TextField
        fullWidth
        label="Food Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        label="Calories"
        type="number"
        name="calories"
        value={formData.calories}
        onChange={handleChange}
        required
        sx={{ mb: 3 }}
      />
      
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, mt: 2, color: 'text.secondary' }}>
        MACRONUTRIENTS (OPTIONAL)
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Protein"
            type="number"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            placeholder="g"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Carbs"
            type="number"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            placeholder="g"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Fat"
            type="number"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            placeholder="g"
          />
        </Grid>
      </Grid>
        
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
        Add to Library
      </Button>
    </Box>
  );
}

export default FoodForm;
