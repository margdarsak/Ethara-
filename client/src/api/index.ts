import axios from 'axios';

// By leaving baseURL empty or using a relative path, 
// it will automatically use your Railway domain in production.
const api = axios.create({
  baseURL: '/api' 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
