import axios from 'axios';

// When deployed on Vercel Services or behind a reverse proxy, the client and API share the domain.
// 1. If VITE_API_URL is explicitly set, use it.
// 2. In local development without environment variable, use 'http://localhost:5000/api'.
// 3. In production on live website, default to relative '/api' so it routes to the backend on the same domain without CORS or network failure.
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout to handle serverless cold starts (Neon PostgreSQL sleep wake-up)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach Bearer token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses for auth errors and meaningful messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
