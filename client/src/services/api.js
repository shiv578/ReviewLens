import axios from 'axios';

/**
 * Normalizes baseURL so that requests always target the /api endpoint
 * whether VITE_API_URL is:
 * - "https://reviewlens-nyqd.onrender.com"
 * - "https://reviewlens-nyqd.onrender.com/api"
 * - or not set (defaults to "/api" for local Vite dev proxy)
 */
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || !envUrl.trim()) return '/api';
  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export default api;
