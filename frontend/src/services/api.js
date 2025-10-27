import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor
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

// Response interceptor for token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('token');
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        const response = await refreshAccessToken(refreshToken);
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        processQueue(null, access_token);
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

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

export const refreshAccessToken = (refreshToken) => {
  return api.post('/auth/refresh', { refresh_token: refreshToken });
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