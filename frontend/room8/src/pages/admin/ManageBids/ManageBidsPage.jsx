// src/pages/admin/ManageBids/ManageBidsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBidService } from '../../../services/useBidService.js';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

import DashboardHeader from '../../../components/shared/DashboardHeader';
import Spinner from '../../ListingDetailsPage/components/Spinner';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { CurrencyDollarIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManageBidsPage = ({ isTenantView = false, isLandlordView = false }) => {
    const navigate = useNavigate();
    // Use our real API service now, not the mock context
    const { getMyBids, getBidsByListingId, removeBid } = useBidService();
    const { authDataState } = useAuth();

    const [bids, setBids] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bidToDelete, setBidToDelete] = useState(null); // For the confirmation modal

    const fetchBids = useCallback(async () => {
        setIsLoading(true);
        try {
            let data = [];
            if (isTenantView) {
                // Fetch all bids for the currently logged-in user
                data = await getMyBids();
            } else if (isLandlordView) {
                // NOTE: The backend doesn't have a single endpoint for "all bids for a landlord's listings".
                // This would require fetching the landlord's listings, then fetching bids for each one.
                // For now, we'll show a message. This would be a good future enhancement for your backend.
                toast.info("Fetching bids by landlord is not yet supported by the API.");
            }
            setBids(data);
        } catch (error) {
            console.error("Failed to fetch bids:", error);
            // Service already shows a toast
        } finally {
            setIsLoading(false);
        }
    }, [getMyBids, isTenantView, isLandlordView]);

    useEffect(() => {
        if (authDataState.userInfo) {
            fetchBids();
        }
    }, [authDataState.userInfo, fetchBids]);

    const handleViewBid = (bid) => {
        // Pass the full bid object and view type to the details page
        navigate(`/admin/bids/${bid.id}`, { state: { bid, isTenantView, isLandlordView } });
    };

    const handleRemoveBid = async () => {
        if (!bidToDelete) return;
        try {
            await removeBid(bidToDelete.id);
            toast.success("Bid has been successfully withdrawn.");
            setBidToDelete(null); // Close the modal
            fetchBids(); // Refresh the list
        } catch (error) {
            console.error("Failed to remove bid:", error);
            setBidToDelete(null);
            // The service shows the error toast
        }
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

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="space-y-6">
            <DashboardHeader
                title={isTenantView ? "Your Submitted Bids" : "Received Bids"}
                subtitle="Track and manage bids for listings"
            />
            {bids.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* ... Table Head ... */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bids.map((bid) => (
                                <tr key={bid.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                                        <Link to={`/listingDetails/${bid.listingId}`}>Listing #{bid.listingId}</Link>
                                    </td>
                                    <td className="px-6 py-4 ...">{/* Display bidder/landlord name if available */}</td>
                                    <td className="px-6 py-4 ...">{/* Display amount if available */}</td>
                                    <td className="px-6 py-4 ..."><span className={`px-2 ... ${getStatusClasses(bid.bidStatus?.toLowerCase())}`}>{bid.bidStatus}</span></td>
                                    <td className="px-6 py-4 ...">{new Date(bid.bidDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleViewBid(bid)} className="text-blue-600 hover:text-blue-800 font-semibold">View Details</button>
                                        {isTenantView && bid.bidStatus === 'PENDING' && (
                                            <button onClick={() => setBidToDelete(bid)} className="ml-4 text-red-600 hover:text-red-800 font-semibold">Withdraw</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

              <h2 className="text-2xl font-bold text-red-500">Bid Not Found</h2>

              <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"> Go Back </button>

              </div>
            )}

            <ConfirmModal
                isOpen={!!bidToDelete}
                onClose={() => setBidToDelete(null)}
                onConfirm={handleRemoveBid}
                title="Withdraw Bid"
            >
                <p>Are you sure you want to permanently withdraw this bid?</p>
                <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
            </ConfirmModal>
        </div>
    );
};

export default ManageBidsPage;