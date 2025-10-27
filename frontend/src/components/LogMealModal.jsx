import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { getFoods, logFood } from '../services/api';
import Modal from './Modal';
import FoodForm from './FoodForm';

function LogMealModal({ onMealLogged, selectedDate }) {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [servings, setServings] = useState(1);
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);

  const fetchFoods = async () => {
    try {
      const response = await getFoods();
      setFoods(response.data);
    } catch (error) {
      console.error("Failed to fetch foods", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleLogFood = async () => {
    if (!selectedFood) {
      alert("Please select a food to log.");
      return;
    }
    try {
      // Use the selected date or today's date in local timezone
      const targetDate = selectedDate || new Date();
      const dateString = formatLocalDate(targetDate);
      
      console.log('Target date object:', targetDate);
      console.log('Formatted date string:', dateString);
      
      const payload = {
        food_id: selectedFood.id,
        servings: parseFloat(servings),
        log_date: dateString,
      };
      console.log('Logging food with payload:', payload);
      const response = await logFood(payload);
      console.log('Food logged successfully:', response.data);
      alert(`${selectedFood.name} logged successfully!`);
      if (onMealLogged) {
        onMealLogged();
      }
    } catch (error) {
      console.error("Failed to log food", error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to log food.";
      alert(`Failed to log food: ${errorMessage}`);
    }
  };
  
  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleFoodAdded = () => {
    setIsAddFoodModalOpen(false);
    fetchFoods();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'stretch' }}>
        <TextField
          fullWidth
          placeholder="Search your food library..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, color: 'text.secondary' }}>
                <Search />
              </Box>
            ),
          }}
        />
        <Button 
          variant="outlined"
          onClick={() => setIsAddFoodModalOpen(true)}
          startIcon={<Add />}
          sx={{ minWidth: 120, textTransform: 'none', fontWeight: 600 }}
        >
          Add Food
        </Button>
      </Box>

      {/* Food List */}
      <Box sx={{ 
        maxHeight: 280, 
        overflow: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 3
      }}>
        {filteredFoods.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No foods found. Add a new food to get started!
            </Typography>
          </Box>
        ) : (
          <Box>
            {filteredFoods.map((food, index) => (
              <Box key={food.id}>
                <Card 
                  sx={{ 
                    borderRadius: 0,
                    border: 'none',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => setSelectedFood(food)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {food.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={`${food.calories} kcal`} 
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            P: {food.protein}g &bull; C: {food.carbs}g &bull; F: {food.fat}g
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                {index < filteredFoods.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Box>
      
      {/* Servings Input and Log Button */}
      {selectedFood && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Selected Food
            </Typography>
            <Typography variant="body1" fontWeight={600}>{selectedFood.name}</Typography>
          </Box>
          <TextField
            fullWidth
            label="Servings"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            type="number"
            inputProps={{ min: 0.1, step: 0.1 }}
            sx={{ mb: 3 }}
          />
          <Button 
            onClick={handleLogFood} 
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
            Log Food
          </Button>
        </Box>
      )}

      <Modal isOpen={isAddFoodModalOpen} onClose={() => setIsAddFoodModalOpen(false)} title="Add to Food Library">
        <FoodForm onFoodAdded={handleFoodAdded} />
      </Modal>
    </Box>
  );
}

export default LogMealModal;