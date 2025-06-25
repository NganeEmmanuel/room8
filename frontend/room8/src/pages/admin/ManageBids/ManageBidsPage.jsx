import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBidService } from '../../../services/useBidService.js';
import { useListingService } from '../../../services/useListingService.js'; // <-- IMPORT LISTING SERVICE
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

import DashboardHeader from '../../../components/shared/DashboardHeader';
import Spinner from '../../ListingDetailsPage/components/Spinner';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const BidTableRow = ({ bid, onSelectBid, isLandlordView, getStatusClasses }) => (
    <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
            {/* The link to the listing details page */}
            <Link to={`/listingDetails/${bid.listingId}`}>Listing #{bid.listingId}</Link>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            {/* For landlord view, the bidder info comes from the mapper service */}
            {isLandlordView ? bid.bidderInfo?.name || 'N/A' : 'My Listing'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            {/* Amount is not in ResponseBidDTO, so we display N/A */}
            N/A
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(bid.bidStatus?.toLowerCase())}`}>
                {bid.bidStatus || 'UNKNOWN'}
            </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {new Date(bid.bidDate).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button onClick={() => onSelectBid(bid)} className="text-blue-600 hover:text-blue-800 font-semibold">
                View Details
            </button>
        </td>
    </tr>
);

const ManageBidsPage = ({ isTenantView = false, isLandlordView = false }) => {
    const navigate = useNavigate();
    const { getMyBids, getBidsByListingId, removeBid } = useBidService();
    const { getMyListings } = useListingService(); // <-- USE LISTING SERVICE
    const { authDataState } = useAuth();

    const [bids, setBids] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bidToDelete, setBidToDelete] = useState(null);

    const handleViewBid = (bid) => {
        navigate(`/admin/bids/${bid.id}`, { state: { bid, isTenantView, isLandlordView } });
    };

    const handleConfirmRemove = async () => {
        if (!bidToDelete) return;
        try {
            await removeBid(bidToDelete.id);
            setBids(prevBids => prevBids.filter(b => b.id !== bidToDelete.id));
            toast.success("Bid has been successfully withdrawn.");
        } catch (error) {
            console.error("Failed to remove bid:", error);
        } finally {
            setBidToDelete(null);
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

    // --- FIX: Updated data fetching logic for Landlord View ---
    useEffect(() => {
        const fetchBids = async () => {
            setIsLoading(true);
            try {
                let data = [];
                if (isTenantView) {
                    // Tenant view: fetch all bids made by the current user
                    data = await getMyBids();
                } else if (isLandlordView) {
                    // Landlord view:
                    // 1. Fetch all of the landlord's listings
                    const userListings = await getMyListings();
                    if (userListings && userListings.length > 0) {
                        // 2. Create an array of promises to fetch bids for each listing
                        const bidPromises = userListings.map(listing =>
                            getBidsByListingId(listing.id).catch(() => []) // Catch errors for individual calls
                        );
                        // 3. Wait for all promises to resolve
                        const bidsByListing = await Promise.all(bidPromises);
                        // 4. Flatten the array of arrays into a single list of bids
                        data = bidsByListing.flat();
                    }
                }
                setBids(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setBids([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (authDataState.userInfo) {
            fetchBids();
        }

    }, []);

    if (isLoading && !bids.length) {
        return <Spinner />;
    }

    if (!authDataState.userInfo && !isLoading) {
        return <div className="p-8 text-center"><p>Verifying user session...</p></div>;
    }

    return (
        <div className="space-y-6">
            <DashboardHeader
                title={isTenantView ? "Your Submitted Bids" : "Received Bids"}
                subtitle="Track the status and manage your proposals"
            />

            {isLoading && bids.length > 0 ? (
                <div className="py-4"><Spinner /></div>
            ) : bids.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isLandlordView ? 'Bidder' : 'Landlord'}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bids.map((bid) => (
                                <BidTableRow
                                    key={bid.id}
                                    bid={bid}
                                    onSelectBid={handleViewBid}
                                    isTenantView={isTenantView}
                                    getStatusClasses={getStatusClasses}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-dashed">
                   <CurrencyDollarIcon className="w-16 h-16 text-gray-300 mx-auto" />
                   <h3 className="text-xl font-semibold text-gray-800 mt-4">No Bids Found</h3>
                   <p className="text-sm text-gray-500 mt-1">{isTenantView ? "You have not placed any bids yet." : "No bids have been received for your listings."}</p>
                </div>
            )}

            <ConfirmModal
                isOpen={!!bidToDelete}
                onClose={() => setBidToDelete(null)}
                onConfirm={handleConfirmRemove}
                title="Withdraw Bid"
            >
                <p>Are you sure you want to permanently withdraw this bid?</p>
                <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
            </ConfirmModal>
        </div>
    );
};

export default ManageBidsPage;
