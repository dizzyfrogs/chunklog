import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  Chip,
  Card,
  CardContent,
  Divider,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { searchFoods, logFood, createFood } from '../services/api';
import Modal from './Modal';

function LogMealModal({ onMealLogged, selectedDate }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [editedFood, setEditedFood] = useState(null);
  const [servings, setServings] = useState(1);
  const [saveToLibrary, setSaveToLibrary] = useState(false);
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch(searchTerm.trim());
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      const response = await searchFoods(query);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Failed to search foods", error);
      toast.error('Failed to search foods.');
    } finally {
      setLoading(false);
    }
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setEditedFood(null);
    setSaveToLibrary(false);
  };

  const handleEditFood = () => {
    if (selectedFood) {
      setEditedFood({
        name: selectedFood.name,
        calories: selectedFood.calories,
        protein: selectedFood.protein,
        carbs: selectedFood.carbs,
        fat: selectedFood.fat,
      });
    }
  };

  const handleLogFood = async () => {
    if (!selectedFood) {
      toast.warning("Please select a food to log.");
      return;
    }

    try {
      const targetDate = selectedDate || new Date();
      const dateString = formatLocalDate(targetDate);
      
      let foodToLog = editedFood || selectedFood;
      
      // If it's an external food and user wants to save to library
      if (!selectedFood.is_from_library && !selectedFood.id && saveToLibrary) {
        // Create food in library first
        const createPayload = {
          name: foodToLog.name,
          calories: foodToLog.calories,
          protein: foodToLog.protein,
          carbs: foodToLog.carbs,
          fat: foodToLog.fat,
        };
        await createFood(createPayload);
        toast.success(`${foodToLog.name} saved to library!`);
      }
      
      // Log the meal
      const payload = {
        servings: parseFloat(servings),
        log_date: dateString,
      };

      // Use external_food if from USDA database
      if (!selectedFood.is_from_library && !selectedFood.id) {
        payload.external_food = foodToLog;
        payload.food_id = null;
      } else {
        payload.food_id = selectedFood.id;
      }

      await logFood(payload);
      toast.success(`${foodToLog.name} logged successfully!`);
      
      if (onMealLogged) {
        onMealLogged();
      }
    } catch (error) {
      console.error("Failed to log food", error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to log food.";
      toast.error(`Failed to log food: ${errorMessage}`);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'stretch' }}>
        <TextField
          fullWidth
          placeholder="Search USDA database or your library..."
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

      {/* Search Results */}
      <Box sx={{ 
        maxHeight: 280, 
        overflow: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 3
      }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Searching...
            </Typography>
          </Box>
        ) : searchResults.length === 0 && searchTerm.length >= 2 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No results found for "{searchTerm}"
            </Typography>
          </Box>
        ) : searchResults.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Start typing to search the USDA database or your library
            </Typography>
          </Box>
        ) : (
          <Box>
            {searchResults.map((food, index) => (
              <Box key={food.id || food.external_id || index}>
                <Card 
                  sx={{ 
                    borderRadius: 0,
                    border: 'none',
                    bgcolor: selectedFood === food ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => handleFoodSelect(food)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body1" fontWeight={600}>
                            {food.name}
                          </Typography>
                          <Chip 
                            label={food.is_from_library ? 'My Library' : 'USDA'}
                            size="small"
                            sx={{ 
                              fontSize: '0.7rem',
                              bgcolor: food.is_from_library ? 'success.light' : 'primary.light',
                              color: 'white'
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={`${food.calories.toFixed(0)} kcal`} 
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            P: {food.protein.toFixed(1)}g &bull; C: {food.carbs.toFixed(1)}g &bull; F: {food.fat.toFixed(1)}g
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                {index < searchResults.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Box>
      
      {/* Food Details and Edit Form */}
      {selectedFood && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Selected Food
            </Typography>
            <Typography variant="body1" fontWeight={600}>{selectedFood.name}</Typography>
          </Box>

          {editedFood ? (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <TextField
                fullWidth
                label="Food Name"
                value={editedFood.name}
                onChange={(e) => setEditedFood({ ...editedFood, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Calories"
                type="number"
                value={editedFood.calories}
                onChange={(e) => setEditedFood({ ...editedFood, calories: parseFloat(e.target.value) || 0 })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Protein (g)"
                type="number"
                value={editedFood.protein}
                onChange={(e) => setEditedFood({ ...editedFood, protein: parseFloat(e.target.value) || 0 })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Carbs (g)"
                type="number"
                value={editedFood.carbs}
                onChange={(e) => setEditedFood({ ...editedFood, carbs: parseFloat(e.target.value) || 0 })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Fat (g)"
                type="number"
                value={editedFood.fat}
                onChange={(e) => setEditedFood({ ...editedFood, fat: parseFloat(e.target.value) || 0 })}
                sx={{ mb: 2 }}
              />
            </Box>
          ) : (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleEditFood}
                sx={{ mb: 1 }}
              >
                Edit Nutritional Values
              </Button>
            </Box>
          )}

          <TextField
            fullWidth
            label="Servings"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            type="number"
            inputProps={{ min: 0.1, step: 0.1 }}
            sx={{ mb: 2 }}
          />

          {!selectedFood.is_from_library && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={saveToLibrary}
                  onChange={(e) => setSaveToLibrary(e.target.checked)}
                  size="small"
                />
              }
              label="Save to my library"
              sx={{ mb: 2 }}
            />
          )}

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
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add a custom food to your library
          </Typography>
          <Box component="form" onSubmit={async (e) => {
            e.preventDefault();
            try {
              const formData = new FormData(e.target);
              const foodData = {
                name: formData.get('name'),
                calories: parseFloat(formData.get('calories')),
                protein: parseFloat(formData.get('protein') || 0),
                carbs: parseFloat(formData.get('carbs') || 0),
                fat: parseFloat(formData.get('fat') || 0),
              };
              await createFood(foodData);
              toast.success(`${foodData.name} added to library!`);
              setIsAddFoodModalOpen(false);
              performSearch(searchTerm);
            } catch (error) {
              toast.error('Failed to add food.');
            }
          }}>
            <TextField
              fullWidth
              label="Food Name"
              name="name"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Calories"
              type="number"
              name="calories"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Protein (g)"
              type="number"
              name="protein"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Carbs (g)"
              type="number"
              name="carbs"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Fat (g)"
              type="number"
              name="fat"
              sx={{ mb: 3 }}
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
              Add to Library
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default LogMealModal;
