import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Brightness4, Brightness7, TrendingUp, Restaurant } from '@mui/icons-material';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import WeightPage from './pages/WeightPage';
import FoodPage from './pages/FoodPage';
import BottomNav from './components/BottomNav';
import Modal from './components/Modal';
import LogMealModal from './components/LogMealModal';
import WeightLog from './components/WeightLog';
import { useAuth } from './context/AuthContext';
import { useAppTheme } from './context/ThemeContext';
import './App.css';

function App() {
  const { token, isProfileComplete } = useAuth();
  const { mode, toggleMode } = useAppTheme();
  const theme = useTheme();
  const [isLoginView, setIsLoginView] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const renderPage = () => {
    // Pass the refresh key to all pages that display dynamic data
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage key={refreshKey} />;
      case 'weight':
        return <WeightPage key={refreshKey} />;
      case 'food':
        return <FoodPage key={refreshKey} />;
      case 'profile':
        // Profile page also needs to trigger a refresh for the dashboard
        return <ProfilePage onProfileUpdate={handleDataRefresh} />;
      default:
        return <DashboardPage key={refreshKey} />;
    }
  };

  const handleWeightLogged = () => {
    setIsWeightModalOpen(false);
    handleDataRefresh(); // Refresh the current page
  };
  
  const handleMealLogged = () => {
    setIsMealModalOpen(false);
    handleDataRefresh(); // Refresh the current page
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      color: 'text.primary',
      background: mode === 'dark' 
        ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)'
    }}>
      {token && (
        <IconButton
          sx={{ 
            position: 'fixed', 
            top: 'calc(16px + env(safe-area-inset-top))', 
            right: 16, 
            zIndex: 1000,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'action.hover' }
          }}
          onClick={toggleMode}
          color="inherit"
        >
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      )}
      
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        pb: token ? 'calc(80px + env(safe-area-inset-bottom))' : 0,
        pt: 'env(safe-area-inset-top)'
      }}>
        <Container maxWidth="sm" sx={{ py: 2 }}>
        {token ? (
          !isProfileComplete ? (
            <Box>
              <Typography variant="h2" gutterBottom>Complete Your Profile</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>Please fill out your profile to continue.</Typography>
              <ProfilePage onProfileUpdate={handleDataRefresh} />
            </Box>
          ) : (
            <>
              {renderPage()}
              
              <BottomNav
                activePage={activePage}
                setActivePage={setActivePage}
              />

              {activePage === 'dashboard' && (
                <SpeedDial
                  ariaLabel="Quick actions"
                  sx={{ position: 'fixed', bottom: 100, right: 16 }}
                  icon={<SpeedDialIcon />}
                >
                  <SpeedDialAction
                    icon={<Restaurant />}
                    tooltipTitle="Log Meal"
                    onClick={() => setIsMealModalOpen(true)}
                  />
                  <SpeedDialAction
                    icon={<TrendingUp />}
                    tooltipTitle="Log Weight"
                    onClick={() => setIsWeightModalOpen(true)}
                  />
                </SpeedDial>
              )}

              <Modal isOpen={isWeightModalOpen} onClose={() => setIsWeightModalOpen(false)} title="Log Your Weight">
                <WeightLog onWeightLogged={handleWeightLogged} />
              </Modal>
              <Modal isOpen={isMealModalOpen} onClose={() => setIsMealModalOpen(false)} title="Log a Meal">
                <LogMealModal onMealLogged={handleMealLogged} />
              </Modal>
            </>
          )
        ) : (
          isLoginView ? (
            <Box>
              <Typography variant="h1" align="center" gutterBottom>Welcome to ChunkLog!</Typography>
              <Login />
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Typography component="span" onClick={() => setIsLoginView(false)} sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}>
                    Sign Up
                  </Typography>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h1" align="center" gutterBottom>Welcome to ChunkLog!</Typography>
              <Signup onSignupSuccess={() => setIsLoginView(true)} />
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Typography component="span" onClick={() => setIsLoginView(true)} sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}>
                    Log In
                  </Typography>
                </Typography>
              </Box>
            </Box>
          )
        )}
        </Container>
      </Box>
    </Box>
  );
}

export default App;