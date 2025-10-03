import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import LogMealModal from '../components/LogMealModal';
import FoodForm from '../components/FoodForm';
import { getFoodLogs } from '../services/api';

function FoodPage() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dailyLog, setDailyLog] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const fetchTodaysLog = async () => {
    setLoading(true);
    try {
      const today = getTodayString();
      const response = await getFoodLogs(today);
      setDailyLog(response.data);
    } catch (error) {
      console.error("Failed to fetch today's log", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysLog();
  }, []);

  const handleMealLogged = () => {
    setIsLogModalOpen(false);
    fetchTodaysLog();
  };

  const totalCalories = dailyLog.reduce((sum, item) => {
    const itemCalories = item.food ? item.food.calories * item.servings : 0;
    return sum + itemCalories;
  }, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Today's Log</h2>
        <div>
          <button onClick={() => setIsLogModalOpen(true)} style={{marginRight: '1rem'}}>Log Meal</button>
        </div>
      </div>
      <hr />
      
      <div>
        <h3>Total Calories: {Math.round(totalCalories)}</h3>
        {loading ? <p>Loading log...</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {dailyLog.map(log => (
              <li key={log.id} style={{ background: 'var(--background)', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                <strong>{log.food.name}</strong> ({log.servings} serving{log.servings > 1 ? 's' : ''})
                <span style={{ float: 'right' }}>{Math.round(log.food.calories * log.servings)} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log a Meal">
        <LogMealModal onMealLogged={handleMealLogged} />
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add to Food Library">
        <FoodForm onFoodAdded={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default FoodPage;