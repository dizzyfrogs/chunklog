import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FiSettings, FiFlag } from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';
import { getUserGoal, getFoodLogs } from '../services/api';
import Modal from '../components/Modal';
import GoalForm from '../components/GoalForm';
import PageHeader from '../components/PageHeader';
import '../styles/Dashboard.css';

const MacroTracker = ({ label, consumed, goal, color }) => {
  const percent = goal > 0 ? (consumed / goal) * 100 : 0;
  return (
    <div className="macro-item">
      <div className="macro-label">{label}</div>
      <div className="macro-progress-container">
        <div 
          className="macro-progress-bar" 
          style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className="macro-values">
        {Math.round(consumed)} / {goal}g
      </div>
    </div>
  );
};

function DashboardPage() {
  const [goal, setGoal] = useState(null);
  const [dailyLog, setDailyLog] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  const consumed = dailyLog.reduce((totals, item) => {
    if (item.food) {
      totals.calories += item.food.calories * item.servings;
      totals.protein += item.food.protein * item.servings;
      totals.carbs += item.food.carbs * item.servings;
      totals.fat += item.food.fat * item.servings;
    }
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  const budget = {
    calories: goal ? goal.target_calories : 0,
    protein: goal ? goal.target_protein : 0,
    carbs: goal ? goal.target_carbs : 0,
    fat: goal ? goal.target_fat : 0,
  };

  const remainingCalories = budget.calories - consumed.calories;
  const progressPercent = budget.calories > 0 ? (consumed.calories / budget.calories) * 100 : 0;

  return (
    <div>
      <PageHeader title="ChunkLog" />

      <h3 className="budget-title">DAILY SUMMARY</h3>

      <div className="chunk-budget">
        <button className="update-goal-icon-btn" onClick={() => setIsModalOpen(true)}>
          <FiSettings />
        </button>

        <div className="progress-circle-container">
          <CircularProgressbar
            value={progressPercent}
            styles={buildStyles({
              pathColor: progressPercent > 100 ? '#fdd835' : 'var(--primary)',
              trailColor: 'var(--background)',
              strokeLinecap: 'round',
            })}
          />
          <div className="circle-text">
            <div className="calorie-number">{Math.round(remainingCalories)}</div>
            <div className="remaining-label">Remaining</div>
          </div>
        </div>
        
        <div className="detail-item">
            <FiFlag className="icon" />
            <div className="text-content">
                <span>Base Goal</span>
                <strong>{budget.calories}</strong>
            </div>
        </div>
        <div className="detail-item">
            <IoFastFoodOutline className="icon" />
            <div className="text-content">
                <span>Food</span>
                <strong>{Math.round(consumed.calories)}</strong>
            </div>
        </div>

        <div className="macro-details">
          <MacroTracker label="Protein" consumed={consumed.protein} goal={budget.protein} color="#e57373" />
          <MacroTracker label="Carbs" consumed={consumed.carbs} goal={budget.carbs} color="#64b5f6" />
          <MacroTracker label="Fat" consumed={consumed.fat} goal={budget.fat} color="#fff176" />
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Your Goal">
        <GoalForm currentGoal={goal} onGoalSet={handleGoalSet} />
      </Modal>
    </div>
  );
}

export default DashboardPage;