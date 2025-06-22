import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';
import { getAccessToken } from '../../utils/tokenUtils';
import { useAuthService } from '../authService/AuthService';
import { useAuth } from '../../context/AuthContext';
import { withRetry } from '../../utils/retryUtils';

const BASE_URL =
  typeof window !== 'undefined' && window._env_?.VITE_AUTH_BASE_URL
    ? window._env_.VITE_AUTH_BASE_URL
    : import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8765';

export const useUserService = () => {
  const { refreshToken } = useAuthService();
  const { setUserInfo, clearAuthData } = useAuth();

  const fetchCurrentUser = async () => {
    const token = getAccessToken();
    const fetchWithToken = async (accessToken) => {
      try {
        const res = await apiClient.get(`${BASE_URL}/auth-service/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) throw new Error('UNAUTHORIZED');
        throw err;
      }
    };

    try {
      const userData = await fetchWithToken(token);
      setUserInfo(userData);
      return userData;
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        try {
          const newAccessToken = await refreshToken();
          const userData = await fetchWithToken(newAccessToken);
          setUserInfo(userData);
          return userData;
        } catch (refreshErr) {
          clearAuthData();
          toast.error('Session expired. Please login again.');
          throw refreshErr;
        }
      }
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch user information');
      throw err;
    }
  };

  const getUserData = async (userId) => {
    const token = getAccessToken();
    if (!token || !userId) {
      throw new Error("Missing token or userId.");
    }

    try {
      const response = await withRetry(() =>
        apiClient.get(`${BASE_URL}/user-service/api/v1/user/get-user-info`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId }
        }), 1, 500
      );

      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load extended user data');
      throw err;
    }
  };

  return {
    fetchCurrentUser,
    getUserData, // 👈 exposed
  };
};
