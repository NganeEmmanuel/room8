const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const saveTokens = ({ token, refreshToken }) => {
  localStorage.setItem(ACCESS_KEY, token);
  localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};
