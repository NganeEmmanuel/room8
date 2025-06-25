import React, { createContext, useContext, useState } from 'react';
import { MOCK_REVIEWS_DB } from '../pages/admin/ManageReviews/mockReviews';

// 1. Create the context
const ReviewContext = createContext();

// 2. Create a custom hook for easy access
export const useReviews = () => useContext(ReviewContext);

// 3. Create the Provider component
export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS_DB);

  // Function to add a new review
  const addReview = (reviewData) => {
    const newReview = {
      id: `rev_${Date.now()}`,
      ...reviewData,
      createdAt: new Date().toISOString(),
    };
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  // Function to update an existing review
  const updateReview = (reviewId, updatedData) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId ? { ...review, ...updatedData } : review
      )
    );
  };

  // Function to delete a review
  const deleteReview = (reviewId) => {
    setReviews(prevReviews =>
      prevReviews.filter(review => review.id !== reviewId)
    );
  };

  const value = {
    reviews,
    addReview,
    updateReview,
    deleteReview,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};