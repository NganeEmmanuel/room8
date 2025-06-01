// src/pages/admin/ProfilePage/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: 'Loading Name...', // Placeholder, replace with actual user data
    email: 'loading@example.com',
    phone: '',
    address: '',
    role: localStorage.getItem('userRole') || 'Guest', // Get role from local storage
    profilePicture: 'https://via.placeholder.com/150/F3F4F6/9CA3AF?text=User', // Default placeholder image
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real application, you would fetch user data from an API here.
    // For demonstration, we'll simulate fetching data.
    const fetchUserProfile = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const storedUserName = localStorage.getItem('userName') || 'John Doe'; // Assuming you store user name
      const storedUserEmail = localStorage.getItem('userEmail') || 'john.doe@example.com';
      const storedUserPhone = localStorage.getItem('userPhone') || '123-456-7890';
      const storedUserAddress = localStorage.getItem('userAddress') || '123 Main St, City, Country';
      const storedUserRole = localStorage.getItem('userRole') || 'Tenant';

      setProfileData({
        name: storedUserName,
        email: storedUserEmail,
        phone: storedUserPhone,
        address: storedUserAddress,
        role: storedUserRole,
        profilePicture: 'https://via.placeholder.com/150/A7D9D9/333333?text=' + storedUserName.charAt(0).toUpperCase(), // Initial from name
      });
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, send updated data to API
    console.log("Saving profile data:", profileData);
    // Simulate saving to local storage (for demonstration)
    localStorage.setItem('userName', profileData.name);
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('userPhone', profileData.phone);
    localStorage.setItem('userAddress', profileData.address);
    // userRole is typically set on login, not edited here

    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
          <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={profileData.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
            {profileData.role === 'tenant-landlord' ? 'Tenant & Landlord' : profileData.role}
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
            <p className="text-gray-500 text-lg">{profileData.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500 mr-3" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <PhoneIcon className="w-5 h-5 text-gray-500 mr-3" />
                  <span>{profileData.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPinIcon className="w-5 h-5 text-gray-500 mr-3" />
                  <span>{profileData.address || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Account Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <UserCircleIcon className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium">Role:</span>
                  <span className="capitalize ml-2">
                    {profileData.role === 'tenant-landlord' ? 'Tenant & Landlord' : profileData.role}
                  </span>
                </div>
                {/* Add other account details like join date, last login, etc. */}
              </div>
            </div>
          </div>

          <div className="text-right">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-lg font-medium shadow-md"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-lg font-medium shadow-md"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 text-lg font-medium shadow-md"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Information</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;