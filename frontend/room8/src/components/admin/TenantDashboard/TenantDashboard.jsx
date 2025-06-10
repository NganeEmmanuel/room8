// src/pages/admin/TenantDashboard/TenantDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  EyeIcon,
  BookmarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import StatCard from "../../shared/StatCard.jsx";
import DashboardHeader from "../../shared/DashboardHeader.jsx";
import RecentActivity from "../../shared/RecentActivity.jsx";
import ListingPreviewCard from "../../../components/shared/ListingPreviewCard.jsx";

// Mock images (replace with actual image imports or URLs from backend)
import house1 from '../../../assets/images/house.png'; // Adjust path as needed
import house2 from '../../../assets/images/house1.png'; // Adjust path as needed

const TenantDashboard = ({ userName = "Tenant" }) => { // Accept userName prop, provide default
  const [stats] = useState({
    savedListings: 2, // Reflecting current savedListings array length
    activeBids: 3,
    pendingBids: 2,
    acceptedBids: 1,
    recentViews: 8
  });

  const [recentActivities] = useState([
    {
      description: "Your bid on 'Spacious room in downtown' was accepted!",
      time: "2 hours ago",
      icon: <CheckCircleIcon className="w-4 h-4" />,
      iconBg: "bg-green-100 text-green-600"
    },
    {
      description: "New listing matches your preferences: 'Sunny Studio near Park'",
      time: "5 hours ago",
      icon: <HeartIcon className="w-4 h-4" />,
      iconBg: "bg-blue-100 text-blue-600"
    },
    {
      description: "Viewed 'Cozy studio apartment'",
      time: "1 day ago",
      icon: <EyeIcon className="w-4 h-4" />,
      iconBg: "bg-gray-100 text-gray-600"
    }
  ]);

  const [savedListings, setSavedListings] = useState([
    {
      id: "1",
      title: "Modern Room in Shared House",
      location: "Downtown Campus Area",
      price: 450,
      image: house1, // Using imported image
      isWishlisted: true,
      currency: "FCFA",
    },
    {
      id: "2",
      title: "Cozy Studio Apartment",
      location: "Near University",
      price: 600,
      image: house2,
      isWishlisted: true,
      currency: "FCFA",
    }
  ]);

  // Update stats.savedListings if savedListings array changes
  useEffect(() => {
    // This is just for local simulation.
    // In a real app, stats.savedListings would come from an API or derived from fetched data.
  }, [savedListings]);


  const handleWishlistToggle = (listingId, currentStatus) => {
    console.log(`Toggling wishlist for ${listingId}. Current status: ${currentStatus}`);
    // API call to UserService/ListingService to update wishlist status would go here
    // For now, update local state for simulation:
    setSavedListings(prevListings =>
      prevListings.map(listing =>
        listing.id === listingId ? { ...listing, isWishlisted: !currentStatus } : listing
      ).filter(listing => currentStatus === false ? true : listing.isWishlisted === true) // if removing, remove from list
    );
    // If you want to remove it from the list immediately when un-wishlisted:
    // setSavedListings(prevListings => prevListings.filter(listing => listing.id !== listingId || !currentStatus));
  };

  return (
    <div className="space-y-6">
      <DashboardHeader userName={userName} userRole="Tenant" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saved Listings"
          value={savedListings.length} // Dynamic count
          icon={<HeartIcon className="w-6 h-6" />}
          color="red"
          subtitle="Your wishlist"
        />
        <StatCard
          title="Active Bids"
          value={stats.activeBids}
          icon={<BookmarkIcon className="w-6 h-6" />}
          color="blue"
          subtitle="Awaiting response"
        />
        <StatCard
          title="Accepted Bids"
          value={stats.acceptedBids}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          color="green"
          subtitle="View contracts" // Example subtitle
        />
        <StatCard
          title="Recently Viewed"
          value={stats.recentViews}
          icon={<EyeIcon className="w-6 h-6" />}
          color="purple"
          subtitle="Last 7 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Saved Listings</h3>
              {savedListings.length > 0 && (
                <Link to="/admin/tenant/saved" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All ({savedListings.length})
                </Link>
              )}
            </div>
            {savedListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedListings.map(listing => (
                  <ListingPreviewCard
                    key={listing.id}
                    listingId={listing.id}
                    title={listing.title}
                    location={listing.location}
                    price={listing.price}
                    currency={listing.currency}
                    image={listing.image}
                    isWishlisted={listing.isWishlisted}
                    onWishlistClick={handleWishlistToggle}
                    isLandlordView={false} // Tenant view, so not landlord
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">You haven't saved any listings yet.</p>
                <Link to="/listings" className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium">
                  Explore Listings
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;