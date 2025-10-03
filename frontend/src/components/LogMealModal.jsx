import React, { useState, useEffect } from 'react';
import { getFoods, logFood } from '../services/api';
import Modal from './Modal';
import FoodForm from './FoodForm';

function LogMealModal({ onMealLogged }) {
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

  const handleLogFood = async () => {
    if (!selectedFood) {
      alert("Please select a food to log.");
      return;
    }
    try {
      await logFood({
        food_id: selectedFood.id,
        servings: parseFloat(servings),
      });
      alert(`${selectedFood.name} logged successfully!`);
      if (onMealLogged) onMealLogged();
    } catch (error) {
      console.error("Failed to log food", error);
      alert("Failed to log food.");
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
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search your food library..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <button 
          onClick={() => setIsAddFoodModalOpen(true)}
          style={{ padding: '0.75rem', lineHeight: 1 }}
        >
          +
        </button>
      </div>

      {/* Food List */}
      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '4px' }}>
        {filteredFoods.map(food => (
          <div
            key={food.id}
            onClick={() => setSelectedFood(food)}
            style={{
              padding: '0.75rem',
              cursor: 'pointer',
              backgroundColor: selectedFood?.id === food.id ? 'var(--primary)' : 'transparent',
              color: selectedFood?.id === food.id ? 'var(--background)' : 'var(--text-primary)',
            }}
          >
            {food.name} ({food.calories} kcal)
          </div>
        ))}
      </div>
      
      {/* Servings Input and Log Button */}
      {selectedFood && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4>Log "{selectedFood.name}"</h4>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              style={{ flex: 1 }}
            />
            <span>serving(s)</span>
          </div>
          <button onClick={handleLogFood} style={{ width: '100%', marginTop: '1rem' }}>Log Food</button>
        </div>
      )}

      {/* Nested Modal for Adding a New Food */}
      <Modal isOpen={isAddFoodModalOpen} onClose={() => setIsAddFoodModalOpen(false)} title="Add to Food Library">
        <FoodForm onFoodAdded={handleFoodAdded} />
      </Modal>
    </div>
  );
}

export default LogMealModal;