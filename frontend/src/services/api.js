import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // We shouldn't redirect directly from here as it might cause loops or bypass React Router,
    // but clearing token helps the AuthContext sync up on next refresh
    localStorage.removeItem('token');
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
       window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api;
