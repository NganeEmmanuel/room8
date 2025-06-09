// src/pages/admin/LandlordDashboard/LandlordDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  EyeIcon,
  BookmarkIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import StatCard from "../../shared/StatCard.jsx";
import DashboardHeader from "../../shared/DashboardHeader.jsx";
import RecentActivity from "../../shared/RecentActivity.jsx";
import ListingPreviewCard from "../../../components/shared/ListingPreviewCard.jsx";

// Mock images (replace with actual image imports or URLs from backend)
import houseImg1 from '../../../assets/images/house.png';
import houseImg2 from '../../../assets/images/house1.png';


const LandlordDashboard = ({ userName = "Landlord" }) => { // Accept userName prop, provide default
  const navigate = useNavigate();

  const [stats] = useState({
    totalListings: 2, // Reflecting current topListings array length
   // activeListings: 2, // Assuming all are active for now
    pendingBids: 8,    // Bids needing review from BidService
    acceptedBids: 12,  // Accepted bids from BidService
    totalViews: 234    // Aggregate views from ListingService
  });

  const [recentActivities] = useState([
    {
      description: "New bid received on 'Luxury Downtown Apartment'",
      time: "1 hour ago",
      icon: <BookmarkIcon className="w-4 h-4" />, // Using Bookmark for bids
      iconBg: "bg-blue-100 text-blue-600"
    },
    {
      description: "'Student-Friendly Room' got 15 new views today",
      time: "3 hours ago",
      icon: <EyeIcon className="w-4 h-4" />,
      iconBg: "bg-green-100 text-green-600"
    },
    {
      description: "Accepted bid from Alex P. for 'Luxury Downtown Apartment'",
      time: "1 day ago",
      icon: <CheckCircleIcon className="w-4 h-4" />,
      iconBg: "bg-green-100 text-green-600"
    }
  ]);

  const [topListings] = useState([ // This would be a few of the landlord's listings from ListingService
    {
      id: "101",
      title: "Luxury Downtown Apartment",
      location: "City Center, Yaoundé",
      price: 80000, // Number
      image: houseImg1,
      views: 145,
      bids: 8,
      currency: "FCFA",
    },
    {
      id: "102",
      title: "Student-Friendly Room",
      location: "Near University, Ngoa-Ekelle",
      price: 40000, // Number
      image: houseImg2,
      views: 89,
      bids: 5,
      currency: "FCFA",
    }
  ]);

  // Update stats.totalListings if topListings array changes (local simulation)
   useEffect(() => {
    // This is just for local simulation.
  }, [topListings]);

  const handleCreateNewListing = () => {
    navigate('/admin/landlord/listings/new');
  };

  return (
    <div className="space-y-6">
      <DashboardHeader userName={userName} userRole="Landlord" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Listings"
          value={topListings.length} // Dynamic count
          icon={<BuildingLibraryIcon className="w-6 h-6" />}
          color="blue"
          subtitle={`${stats.activeListings} active`}
        />
        <StatCard
          title="Pending Bids"
          value={stats.pendingBids}
          icon={<ClockIcon className="w-6 h-6" />}
          color="yellow"
          subtitle="Need review"
        />
        <StatCard
          title="Accepted Bids"
          value={stats.acceptedBids}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          color="green"
          subtitle="View contracts"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={<EyeIcon className="w-6 h-6" />}
          color="purple"
          subtitle="Across all listings"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Your Listings (Top Performing)</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateNewListing}
                  className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm font-medium px-3 py-1.5 rounded-md border border-green-300 hover:bg-green-50 transition-colors"
                >
                  <PlusCircleIcon className="w-4 h-4" /> New Listing
                </button>
                {topListings.length > 0 && (
                    <Link to="/admin/landlord/listings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All ({topListings.length})
                    </Link>
                )}
              </div>
            </div>
            {topListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topListings.map(listing => (
                  <ListingPreviewCard
                    key={listing.id}
                    listingId={listing.id}
                    title={listing.title}
                    location={listing.location}
                    price={listing.price}
                    currency={listing.currency}
                    image={listing.image}
                    views={listing.views}
                    bids={listing.bids}
                    isLandlordView={true} // Landlord view
                    // Edit/Delete actions are on the full ManageListingsPage
                  />
                ))}
              </div>
            ) : (
               <div className="text-center py-8">
                <BuildingLibraryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">You haven't created any listings yet.</p>
                <button
                    onClick={handleCreateNewListing}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircleIcon className="w-5 h-5" /> Create Your First Listing
                </button>
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

export default LandlordDashboard;