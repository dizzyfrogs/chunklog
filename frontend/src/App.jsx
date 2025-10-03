import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { token } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);

  // show dashboard if logged in
  if (token) {
    return (
      <div className="App">
        <header className="App-header">
          <Dashboard />
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ChunkLog!</h1>
        {isLoginView ? (
          <>
            <Login />
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsLoginView(false)} style={linkStyle}>
                Sign Up
              </button>
            </p>
          </>
        ) : (
          <>
            <Signup onSignupSuccess={() => setIsLoginView(true)} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsLoginView(true)} style={linkStyle}>
                Log In
              </button>
            </p>
          </>
        )}
      </header>
    </div>
  );
}

const linkStyle = {
  background: 'none',
  border: 'none',
  color: '#61dafb',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: 'inherit',
};

export default App;