import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_LISTINGS_DB } from '../ManageListings/mockData';
import DashboardHeader from '../../../components/shared/DashboardHeader';
import { StarIcon, CalendarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { useReviews } from '../../../context/ReviewContext'; // --- CORRECTED: Import the context hook ---
import house1 from '../../../assets/images/house.png';

const ReviewDetailsPage = () => {
    const navigate = useNavigate();
    const { reviewId } = useParams();
    const [review, setReview] = useState(null);
    const [listing, setListing] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- CORRECTED: Get reviews and delete function from context ---
    const { reviews, deleteReview } = useReviews();

    useEffect(() => {
        // --- CORRECTED: Find review in the context state, not the static file ---
        const foundReview = reviews.find(r => r.id === reviewId);
        if (foundReview) {
            setReview(foundReview);
            const foundListing = MOCK_LISTINGS_DB.find(l => l.id === foundReview.listingId);
            setListing(foundListing);
        } else {
            toast.error("Review not found!");
            navigate('/admin/reviews');
        }
    }, [reviewId, navigate, reviews]); // --- CORRECTED: Added `reviews` to dependency array ---

    const handleEdit = () => {
        navigate(`/admin/reviews/${reviewId}/edit`);
    };

    const handleDeleteTrigger = () => {
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        // --- CORRECTED: Call the global delete function from context ---
        deleteReview(reviewId);
        toast.success("Review deleted successfully!");
        setIsModalOpen(false);
        navigate('/admin/reviews');
    };

    if (!review || !listing) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="space-y-6">
                <DashboardHeader
                    title="Review Details"
                    subtitle={`Your feedback for the listing: "${listing.title}"`}
                />
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <img src={listing.imagePreviews[0]} alt={listing.title} className="w-full h-48 object-cover" />
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className={`h-6 w-6 ${review.rating > i ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                                <span className="ml-2 text-xl font-bold text-gray-700">{review.rating}.0</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon className="w-4 h-4 mr-1.5" />
                                Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        {review.images && review.images.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-800 mb-2">Photos you shared:</h4>
                                <div className="flex space-x-4">
                                    {review.images.map((img, index) => (
                                        <img key={index} src={house1} alt={`Review photo ${index + 1}`} className="w-32 h-32 object-cover rounded-md shadow-md" />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="border-t mt-6 pt-6 flex justify-end space-x-4">
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <PencilIcon className="w-5 h-5 mr-2" />
                                Edit Review
                            </button>
                            <button
                                onClick={handleDeleteTrigger}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                            >
                                <TrashIcon className="w-5 h-5 mr-2" />
                                Delete Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Review"
            >
                <p>Are you sure you want to permanently delete this review?</p>
                <p className="mt-2 font-semibold text-red-700">This action cannot be undone.</p>
            </ConfirmModal>
        </>
    );
};

export default ReviewDetailsPage;