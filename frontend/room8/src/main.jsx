import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { UserDataProvider } from './context/UserDataContext.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <UserDataProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UserDataProvider>
  // </StrictMode>
);
