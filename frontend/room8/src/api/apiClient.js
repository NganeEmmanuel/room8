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


export default apiClient;
