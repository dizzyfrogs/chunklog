// src/App.jsx
import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { token } = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ChunkLog!</h1>
        {token ? <Dashboard /> : <Login />}
      </header>
    </div>
  );
}

export default App;