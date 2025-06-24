import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useUserService } from '../../../services/userService/userService'; // now a hook, not a function
import Loader from '../../../components/shared/Loader';
import TenantDashboard from '../../../components/admin/TenantDashboard/TenantDashboard';
import LandlordDashboard from '../../../components/admin/LandlordDashboard/LandlordDashboard';
import TenantLandlordDashboard from '../../../components/admin/TenantLandlordDashboard/TenantLandlordDashboard';

const Dashboard = () => {
  const { authDataState } = useAuth();


  const { userRole = [], userInfo } = authDataState;

  if (!userInfo) return <Loader />;

  const hasTenant = userRole.includes("TENANT");
  const hasLandlord = userRole.includes("LANDLORD");

  if (hasTenant && hasLandlord) return <TenantLandlordDashboard userName={userInfo.firstName} />;
  if (hasLandlord) return <LandlordDashboard userName={userInfo.firstName} />;
  if (hasTenant) return <TenantDashboard userName={userInfo.firstName} />;
  
  // Default fallback
  return <TenantLandlordDashboard userName={userInfo.firstName} />;
};

export default Dashboard;
