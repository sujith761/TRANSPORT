import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('Admin API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor - attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors gracefully
// DO NOT force redirect here. Let the AuthContext handle logout/redirect
// to avoid race conditions and redirect loops.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear token on 401 (unauthorized), NOT on 403 (forbidden)
    // 403 means user is authenticated but lacks permission - don't force logout
    if (error.response?.status === 401) {
      const token = localStorage.getItem('adminToken');
      if (token) {
        console.warn('Received 401 - token may be expired or invalid.');
        localStorage.removeItem('adminToken');
        delete api.defaults.headers.common['Authorization'];
        // Use soft redirect only if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
