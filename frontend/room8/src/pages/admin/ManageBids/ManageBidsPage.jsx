// src/pages/admin/ManageBids/ManageBidsPage.jsx
import React, { useState } from 'react';
import DashboardHeader from '../../../components/shared/DashboardHeader';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const ManageBidsPage = ({ isTenantView = false, isLandlordView = false }) => {
  // Mock data for bids
  const [bids, setBids] = useState([
    {
      id: "bid1",
      listingId: "101",
      listingTitle: "Luxury Downtown Apartment",
      bidderName: "Alex P.",
      landlordName: "You (Mock Landlord)",
      amount: 78000,
      currency: "FCFA",
      status: "pending", // 'pending', 'accepted', 'rejected', 'withdrawn'
      bidDate: "2025-05-20",
    },
    {
      id: "bid2",
      listingId: "102",
      listingTitle: "Student-Friendly Room",
      bidderName: "Sarah M.",
      landlordName: "You (Mock Landlord)",
      amount: 39000,
      currency: "FCFA",
      status: "pending",
      bidDate: "2025-05-18",
    },
    {
      id: "bid3",
      listingId: "105",
      listingTitle: "Cozy Studio Near Park",
      bidderName: "You (Mock Tenant)",
      landlordName: "Landlord A",
      amount: 55000,
      currency: "FCFA",
      status: "accepted",
      bidDate: "2025-05-15",
    },
    {
      id: "bid4",
      listingId: "106",
      listingTitle: "Spacious Room in Shared House",
      bidderName: "You (Mock Tenant)",
      landlordName: "Landlord B",
      amount: 42000,
      currency: "FCFA",
      status: "rejected",
      bidDate: "2025-05-10",
    },
    {
      id: "bid5",
      listingId: "101",
      listingTitle: "Luxury Downtown Apartment",
      bidderName: "Mark T.",
      landlordName: "You (Mock Landlord)",
      amount: 79000,
      currency: "FCFA",
      status: "withdrawn",
      bidDate: "2025-05-19",
    }
  ]);

  const handleAcceptBid = (bidId) => {
    if (window.confirm(`Are you sure you want to ACCEPT bid ${bidId}?`)) {
      console.log(`Accepting bid ${bidId}...`);
      // API call to update bid status
      setBids(prevBids => prevBids.map(bid =>
        bid.id === bidId ? { ...bid, status: 'accepted' } : bid
      ));
      alert(`Bid ${bidId} accepted (simulation).`);
    }
  };

  const handleRejectBid = (bidId) => {
    if (window.confirm(`Are you sure you want to REJECT bid ${bidId}?`)) {
      console.log(`Rejecting bid ${bidId}...`);
      // API call to update bid status
      setBids(prevBids => prevBids.map(bid =>
        bid.id === bidId ? { ...bid, status: 'rejected' } : bid
      ));
      alert(`Bid ${bidId} rejected (simulation).`);
    }
  };

  const handleWithdrawBid = (bidId) => {
    if (window.confirm(`Are you sure you want to WITHDRAW bid ${bidId}?`)) {
      console.log(`Withdrawing bid ${bidId}...`);
      // API call to update bid status (from tenant perspective)
      setBids(prevBids => prevBids.map(bid =>
        bid.id === bidId ? { ...bid, status: 'withdrawn' } : bid
      ));
      alert(`Bid ${bidId} withdrawn (simulation).`);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  let filteredBids = bids;
  let pageTitle = "Manage All Bids";
  let pageSubtitle = "Overview of all bids in the system";

  if (isTenantView) {
    filteredBids = bids.filter(bid => bid.bidderName.includes("You (Mock Tenant)"));
    pageTitle = "Your Bids";
    pageSubtitle = "Track the status of your submitted bids";
  } else if (isLandlordView) {
    filteredBids = bids.filter(bid => bid.landlordName.includes("You (Mock Landlord)"));
    pageTitle = "Received Bids";
    pageSubtitle = "Review and respond to bids on your properties";
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title={pageTitle} subtitle={pageSubtitle} />

      {filteredBids.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="align-middle inline-block min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listing
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isLandlordView ? 'Bidder' : 'Landlord'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBids.map((bid) => (
                  <tr key={bid.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <a href={`/listingDetails?listingId=${bid.listingId}`} className="text-blue-600 hover:text-blue-800">
                        {bid.listingTitle}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isLandlordView ? bid.bidderName : bid.landlordName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bid.currency} {Number(bid.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(bid.status)}`}>
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bid.bidDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isLandlordView && bid.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptBid(bid.id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                            title="Accept Bid"
                          >
                            <CheckCircleIcon className="w-5 h-5 inline-block" />
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Bid"
                          >
                            <XCircleIcon className="w-5 h-5 inline-block" />
                          </button>
                        </>
                      )}
                      {isTenantView && bid.status === 'pending' && (
                        <button
                          onClick={() => handleWithdrawBid(bid.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Withdraw Bid"
                        >
                          Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <CurrencyDollarIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bids Found</h3>
          <p className="text-gray-500 mb-4">
            {isTenantView
              ? "You haven't submitted any bids yet, or all your bids have been resolved."
              : isLandlordView
                ? "You haven't received any bids on your properties yet, or all bids have been processed."
                : "There are no bids to display."
            }
          </p>
          {!isLandlordView && (
            <button
              onClick={() => window.location.href = '/listings'}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Explore Listings to Bid
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageBidsPage;