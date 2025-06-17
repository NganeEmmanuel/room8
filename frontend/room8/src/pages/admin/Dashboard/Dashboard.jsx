
import React from 'react';
import TenantDashboard from '../../../components/admin/TenantDashboard/TenantDashboard';
import LandlordDashboard from '../../../components/admin/LandlordDashboard/LandlordDashboard';
import TenantLandlordDashboard from '../../../components/admin/TenantLandlordDashboard/TenantLandlordDashboard';

// Assuming these components also accept a userName prop
const userName = localStorage.getItem('userName') || 'User'; // Get userName for passing down
const role = JSON.parse(localStorage.getItem("userRole")); // Default for testing

  const hasTenant = role.includes("tenant");
  const hasLandlord = role.includes("landlord");

const Dashboard = () => {

  if (hasTenant && hasLandlord) return <TenantLandlordDashboard userName={userName} />;
  
  if (hasLandlord) return <LandlordDashboard userName={userName} />;
  // Defaulting to TenantDashboard if role is "tenant" or not matching the above
  if (hasTenant) return <TenantDashboard userName={userName} />;

  // Fallback if role is something unexpected, or render the combined one by default.
  return <TenantLandlordDashboard userName={userName} />;
};

export default Dashboard;