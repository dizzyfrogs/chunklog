import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
});

//runs before every request
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

export const loginUser = (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email); // expects 'username', not 'email'
  formData.append('password', password);

  return api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

// --- Goal Functions ---
export const getUserGoal = () => {
  return api.get('/goals/');
};

export const setUserGoal = (goalData) => {
  return api.post('/goals/', goalData);
};

export const calculateGoal = (goalData) => {
  return api.post('/goals/calculate', goalData);
};

// --- Weight Log Functions ---
export const getWeightLogs = () => {
  return api.get('/weightlogs/');
};

export const logWeight = (weightData) => {
  return api.post('/weightlogs/', weightData);
};

// --- User Profile Functions ---
export const getCurrentUser = () => {
  return api.get('/users/me');
};

export const updateUserProfile = (profileData) => {
  return api.put('/users/me', profileData);
};

export const signupUser = (userData) => {
  return api.post('/users/', userData);
};


export default api;