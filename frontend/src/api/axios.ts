// frontend/src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://127.0.0.1:5000/api',
  baseURL: 'https://smart-leads-dashboard-cok8.onrender.com', // Make sure this matches your backend!
});

// The Interceptor: Automatically grabs the token and attaches it to the headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // We will save the token here upon login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;