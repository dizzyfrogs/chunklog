import React, { useState } from 'react';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { FiPlus, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
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
import './App.css';
import './styles/Fab.css';

function App() {
  const { token, isProfileComplete } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage key={refreshKey} />;
      case 'weight':
        return <WeightPage key={refreshKey} />;
      case 'food':
        return <FoodPage key={refreshKey} />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage key={refreshKey} />;
    }
  };

  const handleWeightLogged = () => {
    setIsWeightModalOpen(false);
    handleDataRefresh();
  };
  
  const handleMealLogged = () => {
    setIsMealModalOpen(false);
    handleDataRefresh();
  };

  const appContainerStyle = { paddingBottom: '80px' };

  return (
    <div className="App">
      <div className="App-container" style={token ? appContainerStyle : {}}>
        {token ? (
          !isProfileComplete ? (
            <>
              <h2>Complete Your Profile</h2>
              <p>Please fill out your profile to continue.</p>
              <hr/>
              <ProfilePage />
            </>
          ) : (
            <>
              {renderPage()}
              <BottomNav
                activePage={activePage}
                setActivePage={setActivePage}
              />
              {activePage === 'dashboard' && (
                <Fab
                  style={{ bottom: 80, right: 24 }}
                  mainButtonStyles={{ backgroundColor: 'var(--primary)' }}
                  icon={<FiPlus />}
                  event="click"
                  alwaysShowTitle={true}
                >
                  <Action text="Log Meal" onClick={() => setIsMealModalOpen(true)} style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }} >
                    <FiBookOpen />
                  </Action>
                  <Action text="Log Weight" onClick={() => setIsWeightModalOpen(true)} style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }} >
                    <FiTrendingUp />
                  </Action>
                </Fab>
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
            <>
              <h1>Welcome to ChunkLog!</h1>
              <Login />
              <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Don't have an account? <button onClick={() => setIsLoginView(false)} className="link-button">Sign Up</button>
              </p>
            </>
          ) : (
            <>
              <h1>Welcome to ChunkLog!</h1>
              <Signup onSignupSuccess={() => setIsLoginView(true)} />
              <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already have an account? <button onClick={() => setIsLoginView(true)} className="link-button">Log In</button>
              </p>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default App;