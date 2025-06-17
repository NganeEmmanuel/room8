import { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, getRefreshToken, clearTokens, saveTokens } from '../utils/tokenUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authDataState, setAuthDataState] = useState({
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  });

  const isAuthenticated = !!authDataState.accessToken;

  const clearAuthData = () => {
    clearTokens();
    setAuthDataState({ accessToken: null, refreshToken: null });
  };

  const setTokens = ({ token, refreshToken }) => {
    saveTokens({token, refreshToken})
    setAuthDataState({ accessToken: token, refreshToken });
  };

  return (
    <AuthContext.Provider value={{ authDataState, isAuthenticated, setAuthDataState: setTokens, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
