// src/services/userService.js
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';
import { getAccessToken, getRefreshToken } from '../../utils/tokenUtils';
import { useAuthService } from '../authService/AuthService';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8765';

export const useUserService = () => {
  const { refreshToken } = useAuthService();
  const { setUserInfo, clearAuthData } = useAuth();



  const fetchCurrentUser = async () => {
    const token = getAccessToken();

    const fetchWithToken = async (accessToken) => {
        console.log(accessToken)
      try {
        const res = await apiClient.get(`${BASE_URL}/auth-service/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          throw new Error('UNAUTHORIZED');
        }
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
          const newAccessToken = await refreshToken(); // this also updates context
          const userData = await fetchWithToken(newAccessToken);
          setUserInfo(userData);
          return userData;
        } catch (refreshErr) {
          clearAuthData();
          toast.error('Session expired. Please login again.');
          throw refreshErr;
        }
      }

      // Other errors (network, server, etc)
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch user information');
      throw err;
    }
  };

  return { fetchCurrentUser };
};
