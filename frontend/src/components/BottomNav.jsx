import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, TrendingUp, Restaurant, Person } from '@mui/icons-material';

function BottomNav({ activePage, setActivePage }) {
  const handleChange = (event, newValue) => {
    setActivePage(newValue);
  };

  return (
    <Paper sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }} elevation={3}>
      <BottomNavigation 
        value={activePage} 
        onChange={handleChange}
        showLabels
      >
        <BottomNavigationAction label="Home" icon={<Home />} value="dashboard" />
        <BottomNavigationAction label="Weight" icon={<TrendingUp />} value="weight" />
        <BottomNavigationAction label="Food" icon={<Restaurant />} value="food" />
        <BottomNavigationAction label="Profile" icon={<Person />} value="profile" />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;