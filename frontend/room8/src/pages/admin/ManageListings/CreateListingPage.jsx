// src/pages/admin/ManageListings/CreateListingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("New listing created (simulation)!");
    navigate('/admin/landlord/listings'); // Or to the new listing's detail page
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Listing</h2>
      <form onSubmit={handleSubmit}>
        {/* Add your form fields here */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" name="title" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Listing</button>
        <button type="button" onClick={() => navigate(-1)} className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
      </form>
    </div>
  );
};
export default CreateListingPage;