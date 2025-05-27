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
import ListingsSearchResultsPage from './pages/ListingsSearchResultsPage';


import PublicLayout from './layouts/PublicLayout/PublicLayout';
import AdminLayout from './layouts/AdminLayout/AdminLayout';

function App() {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <Router>
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Routes>
  
  <Route path="/ourteam" element={<OurTeam />} />
</Routes>
    </>
    </Router>
  )
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listingDetails" element={<ListingDetailsPage />} />
          <Route path="/listings/search/:term" element={<ListingsSearchResultsPage />} />

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
