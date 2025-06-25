// roleUtils.js
const USER_DATA_KEY = 'userData';

export const saveData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const getData = () => {
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    if (!raw || raw === "undefined") return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Invalid useData in localStorage:", e);
    return [];
  }
};

export const clearData = () => {
  localStorage.removeItem(USER_DATA_KEY);
};
