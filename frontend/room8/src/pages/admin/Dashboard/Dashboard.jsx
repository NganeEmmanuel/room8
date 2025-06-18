import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useUserService } from '../../../services/userService/userService'; // now a hook, not a function
import Loader from '../../../components/shared/Loader';
import TenantDashboard from '../../../components/admin/TenantDashboard/TenantDashboard';
import LandlordDashboard from '../../../components/admin/LandlordDashboard/LandlordDashboard';
import TenantLandlordDashboard from '../../../components/admin/TenantLandlordDashboard/TenantLandlordDashboard';

const Dashboard = () => {
  const { authDataState } = useAuth();
  const { fetchCurrentUser } = useUserService(); // handles token + refresh
  const [loading, setLoading] = useState(true);

  const { userRole = [], userInfo } = authDataState;

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        if (!userInfo) {
          await fetchCurrentUser(); // uses context & sets userInfo inside
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        // optional: redirect to login or show a user-friendly error
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [userInfo, fetchCurrentUser]);

  if (loading || !userInfo) return <Loader />;

  const hasTenant = userRole.includes("TENANT");
  const hasLandlord = userRole.includes("LANDLORD");

  if (hasTenant && hasLandlord) return <TenantLandlordDashboard userName={userInfo.firstName} />;
  if (hasLandlord) return <LandlordDashboard userName={userInfo.firstName} />;
  if (hasTenant) return <TenantDashboard userName={userInfo.firstName} />;
  
  // Default fallback
  return <TenantLandlordDashboard userName={userInfo.firstName} />;
};

export default Dashboard;
