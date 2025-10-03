import React, { useState, useEffect } from 'react';
import { getUserGoal } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Profile from './Profile';
import GoalForm from './GoalForm';
import WeightLog from './WeightLog';

function Dashboard() {
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await getUserGoal();
        setGoal(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No goal set. Create one below!');
          setIsEditing(true);
        } else {
          setError('Could not fetch goal.');
        }
        console.error(err);
      }
    };

    fetchGoal();
  }, []);

  const handleGoalSet = (newGoal) => {
    setGoal(newGoal);
    setIsEditing(false);
  };

  return (
    <div>
        <h2>Dashboard</h2>
        <button onClick={logout}>Logout</button>
        <hr />
        
        {/*Profile Section*/}
        <div>
            <Profile />
        </div>
        <hr />

        <div>
            <WeightLog />
        </div>
        <hr />

      {/*Goal Section*/}
      {goal && !isEditing ? (
        <div>
          <h3>Your Current Goal</h3>
          <p><strong>Type:</strong> {goal.goal_type.replace('_', ' ')}</p>
          <p><strong>Recommended Daily Calories:</strong> {goal.target_calories}</p>
          <button onClick={() => setIsEditing(true)}>Recalculate Goal</button>
        </div>
      ) : (
        !isEditing && <p>{error || 'Loading goal...'}</p>
      )}

      {isEditing && (
        <div>
          <GoalForm onGoalSet={handleGoalSet} />
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;