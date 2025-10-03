import React, { useState, useEffect } from 'react';
import { getUserGoal, getFoodLogs } from '../services/api';
import Modal from '../components/Modal';
import GoalForm from '../components/GoalForm';
import '../styles/Dashboard.css';

function DashboardPage() {
  const [goal, setGoal] = useState(null);
  const [dailyLog, setDailyLog] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      const today = getTodayString();
      const [goalResponse, logResponse] = await Promise.all([
        getUserGoal(),
        getFoodLogs(today)
      ]);
      
      setGoal(goalResponse.data);
      setDailyLog(logResponse.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      if (err.response && err.response.status === 404 && err.config.url.includes('/goals')) {
        setIsModalOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoalSet = (newGoal) => {
    setGoal(newGoal);
    setIsModalOpen(false);
  };

  const consumedCalories = dailyLog.reduce((sum, item) => {
    const itemCalories = item.food ? item.food.calories * item.servings : 0;
    return sum + itemCalories;
  }, 0);
  
  const budget = goal ? goal.target_calories : 0;
  const progressPercent = budget > 0 ? (consumedCalories / budget) * 100 : 0;
  const progressBarClass = `progress-bar ${progressPercent > 100 ? 'over-budget' : ''}`;

  return (
    <div>
      <div className="dashboard-header">
        <h1>ChunkLog</h1>
      </div>
      <div className="chunk-budget">
        <h3>CHUNK BUDGET</h3>
        <p className="calories">{budget}</p>
        <div className="progress-bar-container">
          <div 
            className={progressBarClass}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
        <p className="consumed-text">
          Consumed: <strong>{Math.round(consumedCalories)} kcal</strong> | {Math.round(progressPercent)}%
        </p>
      </div>
      <button className="update-goal-btn" onClick={() => setIsModalOpen(true)}>Update Goal</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Your Goal">
        <GoalForm onGoalSet={handleGoalSet} />
      </Modal>
    </div>
  );
}

export default DashboardPage;