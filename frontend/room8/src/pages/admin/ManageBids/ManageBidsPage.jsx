// src/pages/admin/ManageBids/ManageBidsPage.jsx
import React, { useState } from 'react';
import DashboardHeader from '../../../components/shared/DashboardHeader';
import { CurrencyDollarIcon, EyeIcon as OutlineEyeIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon, EyeIcon as SolidEyeIcon } from '@heroicons/react/24/solid';

// Modal Component for viewing full proposal
const ViewProposalModal = ({ proposal, onClose }) => {
  if (!proposal) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Bid Proposal</h3>
          <div className="mt-2 px-7 py-3 max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line text-left">
              {proposal}
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const ManageBidsPage = ({ isTenantView = false, isLandlordView = false }) => {
  // Mock data for bids, updated to align with Bid.java model
  const [bids, setBids] = useState([
    {
      id: "bid1",
      ListingId: "101", // from Bid.java
      listingTitle: "Luxury Downtown Apartment", // For display, fetched based on ListingId
      bidderId: "userAlex", // from Bid.java
      bidderInfo: { name: "Alex P.", profileImage: "https://placehold.co/40x40/E2E8F0/718096?text=AP" }, // from Bid.java (simplified)
      landlordId: "landlordMain", // Assumed, for tenant view
      landlordName: "You (Mock Landlord)", // For display
      proposal: "I am very interested in this apartment. I am a quiet professional, non-smoker, and have excellent references. I am ready to move in by the first of next month and can offer a 12-month lease.", // from Bid.java
      amount: 78000, // Assuming this is still relevant for UI, might be part of proposal or separate
      currency: "FCFA",
      status: "pending",
      bidDate: "2025-05-20T10:00:00Z", // from Bid.java
      lastUpdated: "2025-05-20T10:00:00Z", // from Bid.java
    },
    {
      id: "bid2",
      ListingId: "102",
      listingTitle: "Student-Friendly Room",
      bidderId: "userSarah",
      bidderInfo: { name: "Sarah M.", profileImage: "https://placehold.co/40x40/E2E8F0/718096?text=SM" },
      landlordId: "landlordMain",
      landlordName: "You (Mock Landlord)",
      proposal: "As a final year student, I am looking for a quiet place to study. This room seems perfect. I can provide proof of funds and a guarantor if needed.",
      amount: 39000,
      currency: "FCFA",
      status: "pending",
      bidDate: "2025-05-18T14:30:00Z",
      lastUpdated: "2025-05-18T14:30:00Z",
    },
    {
      id: "bid3",
      ListingId: "105",
      listingTitle: "Cozy Studio Near Park",
      bidderId: "userYouTenant", // Current user as tenant
      bidderInfo: { name: "You (Mock Tenant)", profileImage: "https://placehold.co/40x40/E2E8F0/718096?text=YT" },
      landlordId: "landlordA",
      landlordName: "Landlord A", // For display
      proposal: "I love the location and the features of this studio. I am looking for a long-term rental.",
      amount: 55000,
      currency: "FCFA",
      status: "accepted",
      bidDate: "2025-05-15T09:00:00Z",
      lastUpdated: "2025-05-16T11:00:00Z",
    },
    {
      id: "bid4",
      ListingId: "106",
      listingTitle: "Spacious Room in Shared House",
      bidderId: "userYouTenant",
      bidderInfo: { name: "You (Mock Tenant)", profileImage: "https://placehold.co/40x40/E2E8F0/718096?text=YT" },
      landlordId: "landlordB",
      landlordName: "Landlord B",
      proposal: "This shared house looks great. I am clean, respectful of others' space, and financially responsible.",
      amount: 42000,
      currency: "FCFA",
      status: "rejected",
      bidDate: "2025-05-10T18:00:00Z",
      lastUpdated: "2025-05-11T10:00:00Z",
    },
    {
      id: "bid5",
      ListingId: "101",
      listingTitle: "Luxury Downtown Apartment",
      bidderId: "userMark",
      bidderInfo: { name: "Mark T.", profileImage: "https://placehold.co/40x40/E2E8F0/718096?text=MT" },
      landlordId: "landlordMain",
      landlordName: "You (Mock Landlord)",
      proposal: "My circumstances have changed, and I need to withdraw my bid. Apologies for any inconvenience.",
      amount: 79000,
      currency: "FCFA",
      status: "withdrawn",
      bidDate: "2025-05-19T11:00:00Z",
      lastUpdated: "2025-05-19T15:00:00Z",
    }
  ]);

  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleViewProposal = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleCloseModal = () => {
    setSelectedProposal(null);
  };

  const handleAcceptBid = (bidId) => {
    // In a real app, use a proper modal confirmation system
    if (window.confirm(`Are you sure you want to ACCEPT bid ${bidId}?`)) {
      console.log(`Accepting bid ${bidId}...`);
      // API call to update bid status
      setBids(prevBids => prevBids.map(bid =>
        bid.id === bidId ? { ...bid, status: 'accepted', lastUpdated: new Date().toISOString() } : bid
      ));
      alert(`Bid ${bidId} accepted (simulation).`); // Replace with toast/notification
    }
  };

  const handleRejectBid = (bidId) => {
    if (window.confirm(`Are you sure you want to REJECT bid ${bidId}?`)) {
      console.log(`Rejecting bid ${bidId}...`);
      setBids(prevBids => prevBids.map(bid =>
        bid.id === bidId ? { ...bid, status: 'rejected', lastUpdated: new Date().toISOString() } : bid
      ));
      alert(`Bid ${bidId} rejected (simulation).`);
    }
  };

  const handleWithdrawBid = (bidId) => {
    if (window.confirm(`Are you sure you want to WITHDRAW bid ${bidId}?`)) {
      console.log(`Withdrawing bid ${bidId}...`);
      setBids(prevBids => prevBids.map(bid =>
        bid.id === bidId ? { ...bid, status: 'withdrawn', lastUpdated: new Date().toISOString() } : bid
      ));
      alert(`Bid ${bidId} withdrawn (simulation).`);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
      case 'withdrawn': return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  let filteredBids = bids;
  let pageTitle = "Manage All Bids";
  let pageSubtitle = "Overview of all bids in the system";

  // In a real app, 'userYouTenant' and 'landlordMain' would be dynamic IDs
  if (isTenantView) {
    filteredBids = bids.filter(bid => bid.bidderId === "userYouTenant");
    pageTitle = "Your Bids";
    pageSubtitle = "Track the status of your submitted bids";
  } else if (isLandlordView) {
    filteredBids = bids.filter(bid => bid.landlordId === "landlordMain"); // Assuming landlordId is available or derived
    pageTitle = "Received Bids";
    pageSubtitle = "Review and respond to bids on your properties";
  }

  return (
    <div className="space-y-6 dark:text-gray-200">
      <DashboardHeader title={pageTitle} subtitle={pageSubtitle} />

      {filteredBids.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Listing
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isLandlordView ? 'Bidder' : 'Landlord'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Proposal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bid Date
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBids.map((bid) => (
                <tr key={bid.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      <a href={`/listingDetails?listingId=${bid.ListingId}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        {bid.listingTitle}
                      </a>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {bid.ListingId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={isLandlordView ? bid.bidderInfo.profileImage : 'https://placehold.co/40x40/CBD5E0/718096?text=L'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {isLandlordView ? bid.bidderInfo.name : bid.landlordName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ID: {isLandlordView ? bid.bidderId : bid.landlordId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {bid.currency} {Number(bid.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="max-w-xs truncate">
                      {bid.proposal}
                    </div>
                    <button
                      onClick={() => handleViewProposal(bid.proposal)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Full Proposal
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(bid.status)}`}>
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(bid.bidDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(bid.lastUpdated).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isLandlordView && bid.status === 'pending' && (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleAcceptBid(bid.id)}
                          className="p-1.5 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 rounded-full hover:bg-green-100 dark:hover:bg-green-700"
                          title="Accept Bid"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectBid(bid.id)}
                          className="p-1.5 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-700"
                          title="Reject Bid"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {isTenantView && bid.status === 'pending' && (
                      <button
                        onClick={() => handleWithdrawBid(bid.id)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Withdraw Bid"
                      >
                        Withdraw
                      </button>
                    )}
                     {bid.status !== 'pending' && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">No actions</span>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <CurrencyDollarIcon className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Bids Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {isTenantView
              ? "You haven't submitted any bids yet, or all your bids have been resolved."
              : isLandlordView
                ? "You haven't received any bids on your properties yet, or all bids have been processed."
                : "There are no bids to display."
            }
          </p>
          {!isLandlordView && !isTenantView && ( // Show only on general "all bids" view if needed
             <p className="text-sm text-gray-400 dark:text-gray-500">This is a general overview. Switch to tenant or landlord view for specific actions.</p>
          )}
          {isTenantView && (
            <button
              onClick={() => window.location.href = '/listings'} // Consider using useNavigate
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Explore Listings to Bid
            </button>
          )}
        </div>
      )}
      {selectedProposal && <ViewProposalModal proposal={selectedProposal} onClose={handleCloseModal} />}
    </div>
  );
};

export default ManageBidsPage;
