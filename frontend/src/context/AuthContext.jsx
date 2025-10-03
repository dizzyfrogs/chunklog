import React, { createContext, useState, useContext } from 'react';
import { getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  const checkProfileCompletion = async () => {
    try {
      const response = await getCurrentUser();
      const user = response.data;
      if (user.date_of_birth && user.gender && user.height_cm) {
        setIsProfileComplete(true);
      } else {
        setIsProfileComplete(false);
      }
    } catch (error) {
      console.error("Failed to check profile completion", error);
      setIsProfileComplete(false);
    }
  };

  const login = async (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    await checkProfileCompletion(); // Check profile status immediately after login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsProfileComplete(true); // Reset on logout
  };

  return (
    <AuthContext.Provider value={{ token, isProfileComplete, login, logout, checkProfileCompletion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);