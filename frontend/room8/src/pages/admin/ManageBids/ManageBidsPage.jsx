import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {useBids} from "../../../context/BidContext.jsx";

// Placeholder for DashboardHeader. In your actual app, import your own.
const DashboardHeader = ({ title, subtitle }) => (
    <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
);





const ManageBidsPage = ({ isTenantView = false, isLandlordView = false }) => {
  const { bids } = useBids();  //using global state not local
  const navigate = useNavigate();

  const handleViewBid = (bid) => {
    navigate(`/admin/bids/${bid.id}`, { state: { bid, isTenantView } });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const { filteredBids, pageTitle, pageSubtitle } = useMemo(() => {
    if (isTenantView) {
      return {
        filteredBids: bids.filter(bid => bid.bidderId === "userYouTenant"),
        pageTitle: "Your Submitted Bids",
        pageSubtitle: "Track the status and manage your proposals"
      }
    }
    if (isLandlordView) {
      return {
        filteredBids: bids.filter(bid => bid.landlordId === "landlordMain"),
        pageTitle: "Received Bids",
        pageSubtitle: "Review bids submitted for your properties"
      }
    }
    return { filteredBids: bids, pageTitle: "Manage All Bids", pageSubtitle: "Overview of all bids in the system" };
  }, [bids, isTenantView, isLandlordView]);

  return (
    <div className="space-y-6">
      <DashboardHeader title={pageTitle} subtitle={pageSubtitle} />
      {filteredBids.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isLandlordView ? 'Bidder' : 'Landlord'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBids.map((bid) => (
                <tr key={bid.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline"><Link to={`/listingDetails?listingId=${bid.ListingId}`}>{bid.listingTitle}</Link></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{isLandlordView ? bid.bidderInfo.name : bid.landlordName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.currency} {Number(bid.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(bid.status)}`}>{bid.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bid.bidDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleViewBid(bid)} className="text-blue-600 hover:text-blue-800">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
         <div className="text-center py-12 bg-white rounded-lg border">
            <CurrencyDollarIcon className="w-20 h-20 text-gray-300 mx-auto" />
            <h3 className="text-xl font-bold text-gray-800 mt-2">No Bids Found</h3>
            <p className="text-sm text-gray-500 mt-1">{isTenantView ? "You have not placed any bids yet." : "No bids have been received for your listings."}</p>
         </div>
      )}
    </div>
  );
};

export default ManageBidsPage;