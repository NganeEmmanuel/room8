// Updated AuthService.js to use AuthContext and enhance UX
import apiClient from '../../utils/apiClient';
import { toast } from 'react-toastify';
import {
  isNotEmpty,
  isValidEmail,
  isValidPhoneNumber,
  isStrongPassword,
  isSafeInput,
} from '../../utils/validators';
import { getRefreshToken } from '../../utils/tokenUtils';
import { useAuth } from '../../context/AuthContext';

const endpoints = {
  tenant: '/auth-service/api/v1/auth/signup/tenant',
  landlord: '/auth-service/api/v1/auth/signup/landlord',
  login: '/auth-service/api/v1/auth/login',
  refresh: '/auth-service/api/v1/auth/refresh-token',
};

const validateSignup = ({ firstName, lastName, email, phoneNumber, password }) => {
  if (![firstName, lastName, email, phoneNumber, password].every(isNotEmpty)) {
    throw new Error('All fields must be filled.');
  }
  if (![firstName, lastName, email, phoneNumber, password].every(isSafeInput)) {
    throw new Error('Invalid characters detected.');
  }
  if (!isValidEmail(email)) throw new Error('Invalid email format.');
  if (!isValidPhoneNumber(phoneNumber)) throw new Error('Invalid phone number format.');
  if (!isStrongPassword(password)) throw new Error('Password is too weak.');
};

export const useAuthService = () => {
  const { setAuthDataState, clearAuthData } = useAuth();

  const signup = async (data) => {
    try {
      validateSignup(data);
      const url = data.userType === 'landlord' ? endpoints.landlord : endpoints.tenant;
      const response = await apiClient.post(url, data);
      setAuthDataState(response.data);
      toast.success('Signup successful!');
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Signup failed');
      throw err;
    }
  };

  const login = async ({ email, password }) => {
    try {
      if (!isValidEmail(email) || !isNotEmpty(password)) {
        throw new Error('Invalid login credentials.');
      }
      const response = await apiClient.post(endpoints.login, { email, password });
      setAuthDataState(response.data);
      toast.success('Login successful!');
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
      throw err;
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      const response = await apiClient.post(
        endpoints.refresh,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      setAuthDataState(response.data);
      return response.data.token;
    } catch (err) {
      clearAuthData();
      toast.error('Session expired. Please login again.');
      throw err;
    }
  };

  return { signup, login, refreshToken };
};
