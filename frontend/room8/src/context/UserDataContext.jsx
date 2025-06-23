import { createContext, useContext, useState } from 'react';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Extended profile info

  const updateUserData = (data) => {
    setUserData(data);
    localStorage.setItem('extended_user_data', JSON.stringify(data));
  };

  const clearUserData = () => {
    setUserData(null);
    localStorage.removeItem('extended_user_data');
  };

  return (
    <UserDataContext.Provider value={{ userData, updateUserData, clearUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
