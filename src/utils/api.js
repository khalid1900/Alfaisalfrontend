import axios from 'axios';

const BASE_URL = 'https://alfaisalbackend.vercel.app/api';
// const BASE_URL = 'http://localhost:5009/api/';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  // Don't set Content-Type here - let it be determined per request
});

// Add token to requests and handle FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If the data is FormData, remove Content-Type so browser sets it with boundary
    // Otherwise, set it to application/json
    if (config.data instanceof FormData) {
      // Let the browser set Content-Type with the correct boundary
      delete config.headers['Content-Type'];
      console.log('📤 Sending FormData request to:', config.url);
    } else {
      config.headers['Content-Type'] = 'application/json';
      console.log('📤 Sending JSON request to:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default api;