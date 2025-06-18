import { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, getRefreshToken, clearTokens, saveTokens } from '../utils/tokenUtils';
import { decodeJwt } from '../utils/jwtUtils';
import { clearRole, getRole, saveRole } from '../utils/roleUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authDataState, setAuthDataState] = useState({
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    userRole: getRole() || null,
    userInfo: null, // 👈 new
  });

  const isAuthenticated = !!authDataState.accessToken;

  const clearAuthData = () => {
    clearTokens();
    clearRole()
    setAuthDataState({ accessToken: null, refreshToken: null, userRole: null });
  };

  // Helper to save tokens and roles at once
  const setTokensAndRole = ({ token, refreshToken }) => {
    saveTokens({ token, refreshToken });
    const decoded = decodeJwt(token);
    console.log('called jwt')
    const roles = decoded?.roles || null; // assuming roles is an array in your token
    saveRole(roles)
    setAuthDataState({ accessToken: token, refreshToken, userRole: roles });
  };

  const setUserInfo = (userDTO) => {
    setAuthDataState(prev => ({ ...prev, userInfo: userDTO }));
  };

  return (
    <AuthContext.Provider value={{ authDataState, isAuthenticated, setAuthDataState: setTokensAndRole, clearAuthData, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
