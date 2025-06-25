import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReviewForm from '../../../components/reviews/ReviewForm';
import DashboardHeader from '../../../components/shared/DashboardHeader';
import { useReviews } from '../../../context/ReviewContext';
import { toast } from 'react-toastify';

const EditReviewPage = () => {
    const navigate = useNavigate();
    const { reviewId } = useParams();
    const [review, setReview] = useState(null);

    const { reviews, updateReview } = useReviews();

    useEffect(() => {
        const reviewToEdit = reviews.find(r => r.id === reviewId);
        if (reviewToEdit) {
            setReview(reviewToEdit);
        } else {
            toast.error("Review not found!");
            navigate('/admin/reviews');
        }
    }, [reviewId, navigate, reviews]);

    const handleEditSubmit = (reviewData) => {
        console.log(`Updating review ${reviewId} with:`, reviewData);
        updateReview(reviewId, reviewData);
        navigate('/admin/reviews');
    };

    if (!review) return <div>Loading review...</div>;

    return (
        <div className="space-y-6">
            <DashboardHeader title="Edit Your Review" subtitle={`You are editing your review for Listing #${review.listingId}`} />
            <ReviewForm
                initialData={review}
                onFormSubmit={handleEditSubmit}
                submitButtonText="Update Review"
            />
        </div>
    );
};
export default EditReviewPage;