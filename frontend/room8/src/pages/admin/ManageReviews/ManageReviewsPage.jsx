import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_LISTINGS_DB } from '../ManageListings/mockData';
import DashboardHeader from '../../../components/shared/DashboardHeader';
import { StarIcon } from '@heroicons/react/24/solid';
import { useReviews } from '../../../context/ReviewContext'; // --- CORRECTED: Using the context is essential ---

const CURRENT_USER_ID = "user123";

const getListingTitle = (listingId) => {
  const listing = MOCK_LISTINGS_DB.find(l => l.id === listingId);
  return listing ? listing.title : "Unknown Listing";
};

const ManageReviewsPage = () => {
    // --- CORRECTED: Get reviews from the global context ---
    const { reviews } = useReviews();

    const myReviews = reviews.filter(review => review.userId === CURRENT_USER_ID);

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Manage Your Reviews"
                subtitle="View, edit, or delete the feedback you've provided"
            />
            <div className="bg-white shadow overflow-hidden rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {myReviews.length > 0 ? myReviews.map(review => (
                        <li key={review.id}>
                            <Link to={`/admin/reviews/${review.id}`} className="block p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-600 truncate">
                                            Review for: {getListingTitle(review.listingId)}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-5 w-5 ${review.rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                                    </div>
                                    <div className="ml-5 flex-shrink-0">
                                        <p className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                        <span className="mt-2 inline-block text-sm font-semibold text-blue-500 hover:text-blue-700">
                                            View Details &rarr;
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    )) : (
                        <div className="text-center p-12">
                            <h3 className="text-lg font-medium text-gray-900">No Reviews Found</h3>
                            <p className="mt-1 text-sm text-gray-500">You have not written any reviews yet.</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ManageReviewsPage;