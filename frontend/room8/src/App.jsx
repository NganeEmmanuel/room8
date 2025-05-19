import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

// Pages
import HomePage from './pages/HomePage/HomePage';
import ListingsPage from './pages/ListingsPage/ListingPage';
import ListingDetailsPage from './pages/ListingDetailsPage/ListingDetailsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import ManageListings from './pages/admin/ManageListings/ManageListingsPage';
import ManageBids from './pages/admin/ManageBids/ManageBidsPage';
import ProfilePage from './pages/admin/ProfilePage/ProfilePage';

import PublicLayout from './layouts/PublicLayout/PublicLayout';
import AdminLayout from './layouts/AdminLayout/AdminLayout';

function App() {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listingDetails" element={<ListingDetailsPage />} />
        </Route>

        {/* Auth Routes (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Admin Routes (Protected + Layout) */}
        <Route
          element={
            <PrivateRoute>
              <AdminLayout isAuthenticated={isAuthenticated} />
            </PrivateRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/listings" element={<ManageListings />} />
          <Route path="/admin/bids" element={<ManageBids />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch unauthorized access to /admin */}
        {!isAuthenticated && (
          <Route path="/admin/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
