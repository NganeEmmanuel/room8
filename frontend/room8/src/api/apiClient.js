import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL =
  typeof window !== 'undefined' && window._env_?.VITE_AUTH_BASE_URL
    ? window._env_.VITE_AUTH_BASE_URL
    : import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8765';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry logic on network failure
apiClient.interceptors.response.use(null, async error => {
  const config = error.config;
  if (!config || config.__retry) return Promise.reject(error);
  config.__retry = true;
  if (!error.response) {
    toast.error("Network error. Retrying...");
    return apiClient(config);
  }
  return Promise.reject(error);
});

export default apiClient;
