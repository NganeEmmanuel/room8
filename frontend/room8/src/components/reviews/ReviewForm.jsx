import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';
import {toast} from "react-toastify";

const MAX_COMMENT_LENGTH = 500;

const ReviewForm = ({ initialData = {}, onFormSubmit, submitButtonText = "Submit Review" }) => {
  const [rating, setRating] = useState(initialData.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialData.comment || '');
  const [images] = useState(initialData.images || []); // For now, just stores URLs
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (rating === 0) {
      newErrors.rating = "Rating is required.";
    }
    if (!comment.trim()) {
      newErrors.comment = "Comment is required.";
    } else if (comment.length > MAX_COMMENT_LENGTH) {
      newErrors.comment = `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onFormSubmit({ rating, comment, images });
       toast.success(initialData.id ? "Review updated successfully!" : "Review submitted successfully!");
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Your Rating <span className="text-red-500">*</span></label>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              {star <= (hoverRating || rating) ? (
                <StarIcon className="w-8 h-8 text-yellow-400" />
              ) : (
                <OutlineStarIcon className="w-8 h-8 text-gray-300" />
              )}
            </button>
          ))}
        </div>
        {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating}</p>}
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment <span className="text-red-500">*</span></label>
        <div className="mt-1 relative">
          <textarea
            id="comment"
            name="comment"
            rows={6}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`block w-full rounded-md shadow-sm sm:text-sm ${errors.comment ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
            placeholder="Tell us about your experience..."
          />
          <div className={`absolute bottom-2 right-2 text-xs ${comment.length > MAX_COMMENT_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
            {comment.length}/{MAX_COMMENT_LENGTH}
          </div>
        </div>
        {errors.comment && <p className="mt-1 text-xs text-red-500">{errors.comment}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Add Photos (Optional)</label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            {/* Image upload logic would go here */}
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p className="text-sm text-gray-600">Image upload functionality coming soon.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;