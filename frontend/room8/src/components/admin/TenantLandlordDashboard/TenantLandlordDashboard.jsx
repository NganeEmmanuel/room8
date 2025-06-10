
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

import TenantDashboard from '../TenantDashboard/TenantDashboard';
import LandlordDashboard from '../LandlordDashboard/LandlordDashboard';
import DashboardHeader from '../../shared/DashboardHeader.jsx';

// Mock images for overview (replace with actual data or remove if not needed for overview)
import profile1 from '../../../assets/images/profile1.png'; // Example tenant avatar
import profile2 from '../../../assets/images/profile2.png'; // Example landlord avatar


const TenantLandlordDashboard = ({ userName = "User" }) => { // Accept userName
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('view') || 'overview'; // 'overview', 'tenant', 'landlord'

  const [activeTab, setActiveTab] = useState(initialTab);

  // Mock stats for the overview tab - these would come from aggregated data
  const tenantOverviewStats = {
    savedListings: 8,
    activeBids: 2,
    acceptedBids: 1,
    avatar: profile1, // Example
  };

  const landlordOverviewStats = {
    totalListings: 3,
    pendingBids: 5,
    acceptedBids: 7,
    avatar: profile2, // Example
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'tenant':
        return <TenantDashboard userName={userName} />;
      case 'landlord':
        return <LandlordDashboard userName={userName} />;
      case 'overview':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tenant Overview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                {tenantOverviewStats.avatar && (
                  <img src={tenantOverviewStats.avatar} alt="Tenant Avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                )}
                <h3 className="text-xl font-semibold text-gray-900">Your Tenant Activity</h3>
              </div>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>Saved Listings: <span className="font-medium">{tenantOverviewStats.savedListings}</span></li>
                <li>Active Bids: <span className="font-medium">{tenantOverviewStats.activeBids}</span></li>
                <li>Accepted Bids: <span className="font-medium text-blue-600">{tenantOverviewStats.acceptedBids}</span></li>
              </ul>
              <button
                onClick={() => setActiveTab('tenant')}
                className="w-full mt-4 bg-blue-50 text-blue-600 py-2.5 px-4 rounded-md hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <UserGroupIcon className="w-5 h-5" /> View Tenant Dashboard
              </button>
            </div>

            {/* Landlord Overview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
               <div className="flex items-center mb-4">
                {landlordOverviewStats.avatar && (
                  <img src={landlordOverviewStats.avatar} alt="Landlord Avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                )}
                <h3 className="text-xl font-semibold text-gray-900">Your Landlord Activity</h3>
              </div>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>Total Listings: <span className="font-medium">{landlordOverviewStats.totalListings}</span></li>
                <li>Pending Bids: <span className="font-medium text-gray-600">{landlordOverviewStats.pendingBids}</span></li>
                <li>Accepted Bids: <span className="font-medium text-blue-600">{landlordOverviewStats.acceptedBids}</span></li>
              </ul>
              <button
                onClick={() => setActiveTab('landlord')}
                className="w-full mt-4 bg-green-50 text-blue-600 py-2.5 px-4 rounded-md hover:bg-green-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <BuildingLibraryIcon className="w-5 h-5" /> View Landlord Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'tenant', name: 'As Tenant', icon: <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'landlord', name: 'As Landlord', icon: <BuildingLibraryIcon className="w-4 h-4 sm:w-5 sm:h-5" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Only show the main combined dashboard header if on the overview tab,
          otherwise, the individual dashboards will show their own headers. */}
      {activeTab === 'overview' && <DashboardHeader userName={userName} userRole="Tenant & Landlord" />}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 sm:p-2">
        <nav className="flex flex-col sm:flex-row sm:space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 my-0.5 sm:my-0 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Render tab content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TenantLandlordDashboard;