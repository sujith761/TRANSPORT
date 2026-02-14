import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:5000/api';

const normalizeApiUrl = (url) => {
  if (!url) {
    return DEFAULT_API_URL;
  }
  const trimmed = url.replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }
  return `${trimmed}/api`;
};

const API_URL = normalizeApiUrl(process.env.REACT_APP_API_URL || DEFAULT_API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        console.warn('Received 401 - token may be expired or invalid.');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        // Only redirect if not already on login or register page
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
