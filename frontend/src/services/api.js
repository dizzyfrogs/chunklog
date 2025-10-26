import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Functions ---
export const loginUser = (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  return api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const signupUser = (userData) => {
  return api.post('/users/', userData);
};

// --- User Profile Functions ---
export const getCurrentUser = () => {
  return api.get('/users/me');
};

export const updateUserProfile = (profileData) => {
  return api.put('/users/me', profileData);
};

// --- Goal Functions ---
export const getUserGoal = () => {
  return api.get('/goals/');
};

export const calculateGoal = (goalData) => {
  return api.post('/goals/calculate', goalData);
};

export const setManualGoal = (goalData) => {
  return api.post('/goals/', goalData);
};

// --- Weight Log Functions ---
export const getWeightLogs = () => {
  return api.get('/weightlogs/');
};

export const logWeight = (weightData) => {
  return api.post('/weightlogs/', weightData);
};

export const deleteWeightLog = (logId) => {
  return api.delete(`/weightlogs/${logId}`);
};

// --- Food Functions ---
export const getFoods = () => {
    return api.get('/foods/');
};

export const createFood = (foodData) => {
  return api.post('/foods/', foodData);
};

// --- Food Log Functions ---
export const getFoodLogs = (log_date) => {
  return api.get(`/foodlogs/?log_date=${log_date}`);
};

export const logFood = (foodLogData) => {
  return api.post('/foodlogs/', foodLogData);
};

export const deleteFoodLog = (logId) => {
  return api.delete(`/foodlogs/${logId}`);
};

export default api;