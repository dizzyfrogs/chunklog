import React, { useState, useEffect } from 'react';
import { getUserGoal } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await getUserGoal();
        setGoal(response.data);
      } catch (err) {
        setError('Could not fetch goal. Have you set one yet?');
        console.error(err);
      }
    };

    fetchGoal();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {goal ? (
        <div>
          <p><strong>Your Goal:</strong> {goal.goal_type}</p>
          <p><strong>Target Calories:</strong> {goal.target_calories || 'Not set'}</p>
          <p><strong>Target Weight:</strong> {goal.target_weight || 'Not set'}</p>
        </div>
      ) : (
        <p>{error || 'Loading goal...'}</p>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;