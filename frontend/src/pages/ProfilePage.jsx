import React from 'react';
import { Box, IconButton, Typography, Button, useTheme } from '@mui/material';
import { Logout, Person } from '@mui/icons-material';
import Profile from '../components/Profile';
import { useAuth } from '../context/AuthContext';

function ProfilePage({ onProfileUpdate }) {
  const { logout, checkProfileCompletion } = useAuth();
  const theme = useTheme();
  const mode = theme.palette.mode;
  
  const handleProfileUpdated = () => {
    checkProfileCompletion();
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 2.5,
        color: 'white',
        boxShadow: mode === 'dark' ? '0 4px 20px rgba(99, 102, 241, 0.3)' : '0 4px 20px rgba(99, 102, 241, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Person />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Your Profile</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
              Manage your settings
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={logout}
          size="medium"
        >
          Logout
        </Button>
      </Box>
      <Profile onProfileUpdate={handleProfileUpdated} />
    </Box>
  );
}
export default ProfilePage;