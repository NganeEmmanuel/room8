
import React from 'react';
import TenantDashboard from '../../../components/admin/TenantDashboard/TenantDashboard';
import LandlordDashboard from '../../../components/admin/LandlordDashboard/LandlordDashboard';
import TenantLandlordDashboard from '../../../components/admin/TenantLandlordDashboard/TenantLandlordDashboard';
import { useAuth } from '../../../context/AuthContext';

// Assuming these components also accept a userName prop
const userName = localStorage.getItem('userName') || 'User'; // Get userName for passing down

const Dashboard = () => {
  const { authDataState } = useAuth();
  const role = authDataState.userRole // Default for testing

  const hasTenant = role.includes("TENANT");
  const hasLandlord = role.includes("LANDLORD");

  if (hasTenant && hasLandlord) return <TenantLandlordDashboard userName={userName} />;

  if (hasLandlord) return <LandlordDashboard userName={userName} />;
  // Defaulting to TenantDashboard if role is "tenant" or not matching the above
  if (hasTenant) return <TenantDashboard userName={userName} />;

  // Fallback if role is something unexpected, or render the combined one by default.
  return <TenantLandlordDashboard userName={userName} />;
};

export default Dashboard;