import React from 'react';
import { Box, Fab } from '@mui/material';
import { Home, Restaurant, Person, TrendingUp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function BottomNav({ activePage, setActivePage }) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  
  const navItems = [
    { icon: Home, label: 'Home', value: 'dashboard' },
    { icon: TrendingUp, label: 'Weight', value: 'weight' },
    { icon: Restaurant, label: 'Food', value: 'food' },
    { icon: Person, label: 'Profile', value: 'profile' },
  ];

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        bottom: 20, 
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: 1,
        bgcolor: mode === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 8,
        p: 1.5,
        boxShadow: mode === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
          : '0 8px 32px rgba(0, 0, 0, 0.15)',
        border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.value;
        return (
          <Fab
            key={item.value}
            size="medium"
            onClick={() => setActivePage(item.value)}
            sx={{
              bgcolor: isActive ? 'primary.main' : 'transparent',
              color: isActive ? 'white' : (mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'),
              '&:hover': {
                bgcolor: isActive ? 'primary.dark' : (mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
              },
              transition: 'all 0.2s',
              boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <Icon />
          </Fab>
        );
      })}
    </Box>
  );
}

export default BottomNav;