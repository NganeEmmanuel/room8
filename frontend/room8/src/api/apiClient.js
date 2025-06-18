import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8765'; //todo change when testing

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 50000, // 5 seconds
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
