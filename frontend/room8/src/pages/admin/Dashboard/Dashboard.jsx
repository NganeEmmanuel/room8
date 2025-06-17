
import React from 'react';
import TenantDashboard from '../../../components/admin/TenantDashboard/TenantDashboard';
import LandlordDashboard from '../../../components/admin/LandlordDashboard/LandlordDashboard';
import TenantLandlordDashboard from '../../../components/admin/TenantLandlordDashboard/TenantLandlordDashboard';

// Assuming these components also accept a userName prop
const userName = localStorage.getItem('userName') || 'User'; // Get userName for passing down

const Dashboard = () => {
  const role = localStorage.getItem('userRole') || "tenant-landlord"; // Default for testing

  if (role === "landlord") return <LandlordDashboard userName={userName} />;

  if (role === "tenant-landlord") return <TenantLandlordDashboard userName={userName} />;
  // Defaulting to TenantDashboard if role is "tenant" or not matching the above
  if (role === "tenant") return <TenantDashboard userName={userName} />;

  // Fallback if role is something unexpected, or render the combined one by default.
  return <TenantLandlordDashboard userName={userName} />;
};

export default Dashboard;