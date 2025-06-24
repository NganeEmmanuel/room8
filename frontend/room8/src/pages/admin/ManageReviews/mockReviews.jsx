// Simulating a database of reviews
export const MOCK_REVIEWS_DB = [
  {
    id: "rev1",
    listingId: "101", // Links to "Luxury Downtown Apartment"
    userId: "user123", // The ID of the user who wrote the review
    authorName: "John Doe",
    rating: 4,
    comment: "This was a great place! Very clean and the landlord was responsive. The location is perfect. Would definitely recommend to anyone visiting Yaoundé.",
    images: ["https://via.placeholder.com/150?text=Review+Img+1"],
    createdAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "rev2",
    listingId: "102",
    userId: "user456",
    authorName: "Jane Smith",
    rating: 5,
    comment: "Excellent room for a student. Close to the university and has everything you need.",
    images: [],
    createdAt: "2025-06-12T14:30:00Z",
  },
  {
    id: "rev3",
    listingId: "101", // another review for the same apartment
    userId: "user789",
    authorName: "Peter Jones",
    rating: 3,
    comment: "It was okay. A bit noisy at night, but overall a decent stay.",
    images: [],
    createdAt: "2025-06-10T08:00:00Z",
  },
  {
    id: "rev4",
    listingId: "103",
    userId: "user123", // another review by John Doe
    authorName: "John Doe",
    rating: 5,
    comment: "Modern, clean, and stylish flat in Douala. Loved it!",
    images: ["https://via.placeholder.com/150?text=Review+Img+A", "https://via.placeholder.com/150?text=Review+Img+B"],
    createdAt: "2025-05-20T18:00:00Z",
  }
];