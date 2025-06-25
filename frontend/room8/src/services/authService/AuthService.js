import apiClient from '../../api/apiClient';
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
import { withRetry } from '../../utils/retryUtils';

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
  const { setAuthDataState, clearAuthData, authDataState } = useAuth();

  const signup = async (data) => {
    try {
      validateSignup(data);
      const url = data.userType === 'landlord' ? endpoints.landlord : endpoints.tenant;

      const response = await withRetry(() => apiClient.post(url, data), 1, 1000); // retry once
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

      const response = await withRetry(() => apiClient.post(endpoints.login, { email, password }), 1, 1000);
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
      // clearAuthData();
      toast.error('Session expired. Please login again.');
      throw err;
    }
  };

  const verifyPhoneNumber = async (otpCode, phoneNumber) => {
    console.log("sending requst")
    try {
      const token = authDataState?.accessToken;
      if (!token) throw new Error('User not authenticated.');

      const res = await apiClient.put(
        '/auth-service/api/v1/auth/marked-as-verified/phone',
        { otpCode, phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
      return false;
    }
  };


  const resendCode = async ({ phoneNumber, email }) => {
  try {
    const token = authDataState?.accessToken;
    if (!token) throw new Error('User not authenticated.');

    if (!phoneNumber && !email) {
      throw new Error('Phone number or email is required to resend the code.');
    }

    const response = await apiClient.put(
      '/auth-service/api/v1/auth/resend-code',
      null,
      {
        params: { phoneNumber, email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('Verification code resent!');
    return response.data; // Boolean true/false
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to resend verification code');
    return false;
  }
};


  return { signup, login, refreshToken, verifyPhoneNumber, resendCode  };
};
