import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthRestorer = () => {
  const { setAuthDataState } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (token && refreshToken) {
      setAuthDataState({ token, refreshToken });
    }
  }, []);

  return null; // No UI
};

export default AuthRestorer;
