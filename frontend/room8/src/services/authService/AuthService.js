// Updated AuthService.js to use AuthContext and enhance UX
import apiClient from '../../utils/apiClient';
import { toast } from 'react-toastify';
import {
  isNotEmpty,
  isValidEmail,
  isValidPhoneNumber,
  isStrongPassword,
  isSafeInput,
} from '../utils/validators';
import { saveTokens, getRefreshToken } from '../utils/tokenUtils';
import { useAuth } from '../context/AuthContext';

const endpoints = {
  tenant: '/tenant/signup',
  landlord: '/landlord/signup',
  login: '/login',
  refresh: '/refresh',
};

const validateSignup = ({ firstname, lastname, email, phoneNumber, password }) => {
  if (![firstname, lastname, email, phoneNumber, password].every(isNotEmpty)) {
    throw new Error('All fields must be filled.');
  }
  if (![firstname, lastname, email, phoneNumber, password].every(isSafeInput)) {
    throw new Error('Invalid characters detected.');
  }
  if (!isValidEmail(email)) throw new Error('Invalid email format.');
  if (!isValidPhoneNumber(phoneNumber)) throw new Error('Invalid phone number format.');
  if (!isStrongPassword(password)) throw new Error('Password is too weak.');
};

export const useAuthService = () => {
  const { setAuthData, clearAuthData } = useAuth();

  const signup = async (data) => {
    try {
      validateSignup(data);
      const url = data.userType === 'landlord' ? endpoints.landlord : endpoints.tenant;
      const response = await apiClient.post(url, data);
      saveTokens(response.data);
      setAuthData(response.data);
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
      saveTokens(response.data);
      setAuthData(response.data);
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
      saveTokens(response.data);
      setAuthData(response.data);
      return response.data.token;
    } catch (err) {
      clearAuthData();
      toast.error('Session expired. Please login again.');
      throw err;
    }
  };

  return { signup, login, refreshToken };
};
