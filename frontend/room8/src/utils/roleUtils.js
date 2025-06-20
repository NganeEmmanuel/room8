// roleUtils.js
const USER_ROLE_KEY = 'userRole';

export const saveRole = ({ roles }) => {
  localStorage.setItem(USER_ROLE_KEY, JSON.stringify(roles));
};

export const getRole = () => {
  try {
    const raw = localStorage.getItem(USER_ROLE_KEY);
    if (!raw || raw === "undefined") return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Invalid userRole in localStorage:", e);
    return [];
  }
};

export const clearRole = () => {
  localStorage.removeItem(USER_ROLE_KEY);
};
