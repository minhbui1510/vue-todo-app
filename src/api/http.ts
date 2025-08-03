import axios from 'axios';
import type { AxiosInstance } from 'axios';


const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.API_URL || 'localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
