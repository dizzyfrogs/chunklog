import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
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
      alert(`${formData.name} added to your food library!`);
      setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      if (onFoodAdded) onFoodAdded();
    } catch (error) {
      console.error('Failed to create food:', error);
      alert('Failed to add food.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
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
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Protein (g)"
        type="number"
        name="protein"
        value={formData.protein}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Carbs (g)"
        type="number"
        name="carbs"
        value={formData.carbs}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Fat (g)"
        type="number"
        name="fat"
        value={formData.fat}
        onChange={handleChange}
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
          textTransform: 'none'
        }}
      >
        Add Food
      </Button>
    </Box>
  );
}

export default FoodForm;