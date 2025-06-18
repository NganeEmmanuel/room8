// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Required for styles

import { useAuth } from './context/AuthContext.jsx';
// import PrivateRoute from './components/PrivateRoute/PrivateRoute'; // protects admin routes, commented for testing purposes

// Public Pages
import HomePage from './pages/HomePage/HomePage';
import ListingsPage from './pages/ListingsPage/ListingPage'; // Public listings page
import ListingDetailsPage from './pages/ListingDetailsPage/ListingDetailsPage'; // Public listing details
import ListingsSearchResultsPage from './pages/ListingsSearchResultsPage';
import OurServicesPage from './pages/OurServicesPage/OurServicesPage';
import OurTeam from './pages/OurTeam/OurTeam.jsx'

// Auth Pages
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';

// Admin Area Pages
import Dashboard from './pages/admin/Dashboard/Dashboard'; // The intelligent dashboard router
import ManageListingsPage from './pages/admin/ManageListings/ManageListingsPage'; // Full page for landlord's listings
import ManageBidsPage from './pages/admin/ManageBids/ManageBidsPage'; // Full page for managing bids (tenant/landlord)
import ProfilePage from './pages/admin/ProfilePage/ProfilePage';
import CreateListingPage from './pages/admin/ManageListings/CreateListingPage'; // Page for creating new listing
import EditListingPage from './pages/admin/ManageListings/EditListingPage'; // Page for editing a listing
import SettingsPage from "./pages/admin/SettingsPage/SettingsPage.jsx"; // This layout wraps all authenticated admin routes
import TenantSavedListingsPage from "./pages/admin/TenantSavedListingsPage/TenantSavedListingsPage.jsx";
import TenantRecentlyViewedPage from "./pages/admin/TenantRecentlyViewedPage/TenantRecentlyViewedPage.jsx";
import BidDetailsPage from './pages/admin/ManageBids/BidDetailsPage';
// Layouts
import PublicLayout from './layouts/PublicLayout/PublicLayout';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import {BidsProvider} from "./context/BidContext.jsx";
import AuthRestorer from './auth/AuthRestorer.jsx';


// This layout wraps all authenticated admin routes




function App() {
  // This is a basic check. A robust solution would use an AuthContext.

    const { isAuthenticated} = useAuth();

    // const isAuthenticated = true; // Override for now to test admin section
    // localStorage.setItem("userRole", JSON.stringify(["tenant"]));


  return (
      <BidsProvider>
        <AuthRestorer />
        <Router>
          <Routes>
            {/* Public Routes with PublicLayout */}
            <Route element={<PublicLayout isAuthenticated={isAuthenticated} />}>
              <Route path="/h" element={<Navigate to="/home" replace />} />
              <Route path="/admin/browse" element={<Navigate to="/search" replace />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/listingDetails" element={<ListingDetailsPage />} /> {/* Route for specific listing details */}
              {/*  have /listingDetails and also use a query param ?listingId=...
                  Ensure ListingDetailsPage can handle fetching data based on a URL param if you go with /listing/:listingId
                  or continue using query params. For simplicity, /listingDetails is kept.
              */}
              <Route path="/listings/search/:term" element={<ListingsSearchResultsPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<ListingsSearchResultsPage />} />
              <Route path="/ourservices" element={<OurServicesPage />} />
              <Route path="/team" element={<OurTeam />} />

              {/* Add other public pages like /about, /services if needed */}
            </Route>

            {/* Auth Routes (typically no shared layout or a very minimal one) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Admin Routes (Protected by AdminLayout which should enforce auth) */}
            {/* The AdminLayout itself can handle redirecting if not authenticated,
                or you can wrap individual routes with a PrivateRoute component.
                For now, AdminLayout is assumed to manage its content based on isAuthenticated.
            */}
            <Route
              element={
                isAuthenticated ? (
                  <AdminLayout isAuthenticated={isAuthenticated} />
                ) : (
                  <Navigate to="/login" replace state={{ from: window.location.pathname }} />
                )
              }
            >
              {/* Main Dashboard - this intelligently renders Tenant, Landlord, or TenantLandlordDashboard */}
              <Route path="/admin/dashboard" element={<Dashboard />} />

              {/* Tenant Specific Routes (linked from "View All" on TenantDashboard or future sidebar links) */}
              <Route path="/admin/tenant/saved" element={<TenantSavedListingsPage />} />
              <Route path="/admin/tenant/bids" element={<ManageBidsPage isTenantView={true} />} />
              <Route path="/admin/tenant/recent" element={<TenantRecentlyViewedPage/>} />

              {/* Landlord Specific Routes (linked from "View All" on LandlordDashboard or future sidebar links) */}
              <Route path="/admin/landlord/listings" element={<ManageListingsPage isLandlordView={true} />} />
              <Route path="/admin/landlord/listings/new" element={<CreateListingPage />} />
              <Route path="/admin/landlord/listings/:listingId/edit" element={<EditListingPage />} />
              <Route path="/admin/landlord/bids" element={<ManageBidsPage isLandlordView={true} />} />

              <Route path="/admin/bids/:bidId" element={<BidDetailsPage />} />

              {/* Common Admin Routes */}
              <Route path="/admin/profile" element={<ProfilePage />} />
              <Route path="/admin/settings" element={<SettingsPage/>} />

              {/* Fallback for any /admin/* routes not matched above within the AdminLayout */}
              <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Fallback for any other unmatched routes (optional, good for 404) */}
            {/* This should be outside the authenticated admin routes block if you want a public 404 */}
            <Route path="*" element={<div>404 Page Not Found</div>} />
          </Routes>

          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Router>
      </BidsProvider>
  );
}

export default App;