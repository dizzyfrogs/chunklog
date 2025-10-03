import React, { useState } from 'react';
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
    <form onSubmit={handleSubmit}>
      <h4>Add a New Food to Your Library</h4>
      <div>
        <label>Food Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Calories:</label>
        <input type="number" name="calories" value={formData.calories} onChange={handleChange} required />
      </div>
      <div>
        <label>Protein (g):</label>
        <input type="number" name="protein" value={formData.protein} onChange={handleChange} />
      </div>
      <div>
        <label>Carbs (g):</label>
        <input type="number" name="carbs" value={formData.carbs} onChange={handleChange} />
      </div>
      <div>
        <label>Fat (g):</label>
        <input type="number" name="fat" value={formData.fat} onChange={handleChange} />
      </div>
      <button type="submit">Add Food</button>
    </form>
  );
}

export default FoodForm;