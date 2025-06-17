import { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, getRefreshToken, clearTokens } from '../utils/tokenUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  });

  const isAuthenticated = !!authData.accessToken;

  const clearAuthData = () => {
    clearTokens();
    setAuthData({ accessToken: null, refreshToken: null });
  };

  const setTokens = ({ token, refreshToken }) => {
    setAuthData({ accessToken: token, refreshToken });
  };

  return (
    <AuthContext.Provider value={{ authData, isAuthenticated, setAuthData: setTokens, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
