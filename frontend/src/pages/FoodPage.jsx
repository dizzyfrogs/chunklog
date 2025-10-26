import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import LogMealModal from '../components/LogMealModal';
import FoodForm from '../components/FoodForm';
import { getFoodLogs, deleteFoodLog } from '../services/api';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PageHeader from '../components/PageHeader';
import '../styles/FoodPage.css';

const formatTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const groupMeals = (logs) => {
    const groups = { Morning: [], Afternoon: [], Evening: [] };
    logs.forEach(log => {
        const hour = new Date(log.timestamp * 1000).getHours();
        if (hour < 12) {
            groups.Morning.push(log);
        } else if (hour < 17) {
            groups.Afternoon.push(log);
        } else {
            groups.Evening.push(log);
        }
    });
    return groups;
};

function FoodPage() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dailyLog, setDailyLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const toYYYYMMDD = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  const fetchLogForDate = async (date) => {
    setLoading(true);
    try {
      const dateString = toYYYYMMDD(date);
      const response = await getFoodLogs(dateString);
      setDailyLog(response.data);
    } catch (error) {
      console.error(`Failed to fetch log for ${toYYYYMMDD(date)}`, error);
      setDailyLog([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogForDate(currentDate);
  }, [currentDate]);

  const handleMealLogged = () => {
    setIsLogModalOpen(false);
    fetchLogForDate(currentDate);
  };

  const handleDeleteLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteFoodLog(logId);
        fetchLogForDate(currentDate);
      } catch (error) {
        console.error('Failed to delete food log', error);
        alert('Failed to delete entry.');
      }
    }
  };

  const goToPreviousDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const goToNextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const totalCalories = dailyLog.reduce((sum, item) => {
    const itemCalories = item.food ? item.food.calories * item.servings : 0;
    return sum + itemCalories;
  }, 0);

  const mealGroups = groupMeals(dailyLog);

  return (
    <div>
      <PageHeader title="Food Log" />
      <hr />

      <div className="date-navigator">
        <button onClick={goToPreviousDay} className="date-nav-btn"><FiChevronLeft /></button>
        <span className="date-display">{currentDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
        <button onClick={goToNextDay} className="date-nav-btn"><FiChevronRight /></button>
      </div>

      <div className="calorie-summary-card">
        <div className="label">Total Calories</div>
        <div className="value">{Math.round(totalCalories)}</div>
      </div>
      
      <div className="log-meal-action">
          <button onClick={() => setIsLogModalOpen(true)}>Log Meal</button>
      </div>

      {loading ? <p>Loading log...</p> : (
        <div>
          {Object.entries(mealGroups).map(([groupName, logs]) => (
            logs.length > 0 && (
              <div key={groupName} className="meal-group">
                <div className="meal-group-header">{groupName}</div>
                {logs.map(log => (
                  <div key={log.id} className="log-item">
                    <div className="log-item-details">
                      <div className="name">{log.food.name}</div>
                      <div className="info">
                        {log.servings} serving{log.servings > 1 ? 's' : ''} &bull; {formatTime(log.timestamp)}
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                      <div className="log-item-calories">
                        {Math.round(log.food.calories * log.servings)}
                      </div>
                      <button 
                        onClick={() => handleDeleteLog(log.id)}
                        style={{ 
                          background: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ))}
          {!loading && dailyLog.length === 0 && (
            <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem'}}>
                No meals logged for this day.
            </p>
          )}
        </div>
      )}

      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log a Meal">
        <LogMealModal onMealLogged={handleMealLogged} selectedDate={currentDate} />
      </Modal>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add to Food Library">
        <FoodForm onFoodAdded={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default FoodPage;