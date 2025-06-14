import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

// Placeholder for DashboardHeader. In your actual app, import your own.
const DashboardHeader = ({ title, subtitle }) => (
    <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
);

// Expanded and updated mock data for both Tenant and Landlord views
const mockBidsData = [
  {
    id: "bidTenant1",
    ListingId: "101",
    listingTitle: "Luxury Downtown Apartment",
    bidderId: "userYouTenant", // Bid made BY the logged-in tenant
    landlordId: "landlordPrestige",
    landlordName: "Prestige Rentals",
    proposal: "This is my proposal for the downtown apartment. My detailed profile is kept secret for the moment, willing to share if required",
    amount: 75000,
    currency: "FCFA",
    status: "pending",
    bidDate: "2025-06-10T11:00:00Z",
    shareUserInfo: false, // Tenant IS sharing their info for this bid
    bidderInfo: { name: "You (Tenant)", email: "tenant@example.com", phoneNumber: "555-123-4567", profileImage: "https://i.pravatar.cc/150?u=tenantYou", userInfo: {  } }
  },
  {
    id: "bidTenant2",
    ListingId: "202",
    listingTitle: "Charming Studio in Bastos",
    bidderId: "userYouTenant", // Bid made BY the logged-in tenant
    landlordId: "landlordHome",
    landlordName: "Home Sweet Home",
    proposal: "I would like to apply for the charming studio. I'm sharing my detailed profile for this awesome listing.",
    amount: 50000,
    currency: "FCFA",
    status: "accepted",
    bidDate: "2025-06-05T09:00:00Z",
    shareUserInfo: true, // Tenant IS  sharing their info for this bid
    bidderInfo: { name: "You (Tenant)", email: "tenant@example.com", phoneNumber: "555-123-4567", profileImage: "https://i.pravatar.cc/150?u=tenantYou", userInfo:
           { occupation: 'Software Engineer', employmentStatus: 'Employed', nationality: 'Canadian', languagesSpoken: ['English', 'French'],
             smokingStatus: 'Non-smoker', addictionStatus: 'None', hasPets: false, petPreference: 'None', petsAllowed: [], dietaryRestrictions: 'None',
             otherDietaryRestrictions: [], cleanlinessLevel: 'Very Tidy', sleepSchedule: 'Early Bird', comfortableWithGuests: 'Yes, with notice', partyHabits: 'Rarely', sharesFood: 'Sometimes, please ask',
             preferredRoomTemperature: 'Moderate', willingToShareBathroom: true, hasMedicalConditions: true, medicalConditions: ['Pollen Allergy'], isDisabled: false,
             disability: 'None', personalityType: 'Introvert', noiseTolerance: 'Prefers quiet', enjoysSocializingWithRoommates: 'Occasionally', willingToSplitUtilities: true,
            monthlyIncome: 6000, incomeCurrency: 'FCFA',
           } }
  },
  {
    id: "bidLandlord1",
    ListingId: "yourProperty123",
    listingTitle: "Cozy Room near Omnisports",
    bidderId: "userAlex",
    landlordId: "landlordMain", // Bid received BY the logged-in landlord
    landlordName: "You (Landlord)",
    proposal: "I am a quiet professional, non-smoker, and have excellent references. My full profile is attached for your review.",
    amount: 45000,
    currency: "FCFA",
    status: "pending",
    bidDate: "2025-06-12T14:30:00Z",
    shareUserInfo: true, // This bidder shared their info
    bidderInfo: { name: "Alex P.", email: "alex.p@example.com", phoneNumber: "111-222-3333", profileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
      userInfo:
           { occupation: 'Software Engineer', employmentStatus: 'Employed', nationality: 'Canadian', languagesSpoken: ['English', 'French'],
             smokingStatus: 'Non-smoker', addictionStatus: 'None', hasPets: false, petPreference: 'None', petsAllowed: [], dietaryRestrictions: 'None',
             otherDietaryRestrictions: [], cleanlinessLevel: 'Very Tidy', sleepSchedule: 'Early Bird', comfortableWithGuests: 'Yes, with notice', partyHabits: 'Rarely', sharesFood: 'Sometimes, please ask',
             preferredRoomTemperature: 'Moderate', willingToShareBathroom: true, hasMedicalConditions: true, medicalConditions: ['Pollen Allergy'], isDisabled: false,
             disability: 'None', personalityType: 'Introvert', noiseTolerance: 'Prefers quiet', enjoysSocializingWithRoommates: 'Occasionally', willingToSplitUtilities: true,
            monthlyIncome: 6000, incomeCurrency: 'FCFA',
           }
    }
  },
  {
    id: "bidLandlord2",
    ListingId: "yourProperty456",
    listingTitle: "Modern Flat in Hippodrome",
    bidderId: "userSandra",
    landlordId: "landlordMain", // Bid received BY the logged-in landlord
    landlordName: "You (Landlord)",
    proposal: "Hello, I am interested in your property. My proposal is attached but I have chosen to keep my detailed information private for now.",
    amount: 90000,
    currency: "FCFA",
    status: "pending",
    bidDate: "2025-06-14T10:00:00Z",
    shareUserInfo: false, // This bidder did NOT share their info
    bidderInfo: { name: "Sandra B.", email: "sandra.b@example.com", phoneNumber: "222-333-4444", profileImage: "https://i.pravatar.cc/150?u=sandra", userInfo: { } }
  }
];


const ManageBidsPage = ({ isTenantView = false, isLandlordView = false }) => {
  const [bids] = useState(mockBidsData);
  const navigate = useNavigate();

  const handleViewBid = (bid) => {
    navigate(`/admin/bids/${bid.id}`, { state: { bid, isTenantView } });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const { filteredBids, pageTitle, pageSubtitle } = useMemo(() => {
    if (isTenantView) {
      return {
        filteredBids: bids.filter(bid => bid.bidderId === "userYouTenant"),
        pageTitle: "Your Submitted Bids",
        pageSubtitle: "Track the status and manage your proposals"
      }
    }
    if (isLandlordView) {
      return {
        filteredBids: bids.filter(bid => bid.landlordId === "landlordMain"),
        pageTitle: "Received Bids",
        pageSubtitle: "Review bids submitted for your properties"
      }
    }
    return { filteredBids: bids, pageTitle: "Manage All Bids", pageSubtitle: "Overview of all bids in the system" };
  }, [bids, isTenantView, isLandlordView]);

  return (
    <div className="space-y-6">
      <DashboardHeader title={pageTitle} subtitle={pageSubtitle} />
      {filteredBids.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{isLandlordView ? 'Bidder' : 'Landlord'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBids.map((bid) => (
                <tr key={bid.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline"><Link to={`/listingDetails?listingId=${bid.ListingId}`}>{bid.listingTitle}</Link></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{isLandlordView ? bid.bidderInfo.name : bid.landlordName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.currency} {Number(bid.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(bid.status)}`}>{bid.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bid.bidDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleViewBid(bid)} className="text-blue-600 hover:text-blue-800">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
         <div className="text-center py-12 bg-white rounded-lg border">
            <CurrencyDollarIcon className="w-20 h-20 text-gray-300 mx-auto" />
            <h3 className="text-xl font-bold text-gray-800 mt-2">No Bids Found</h3>
            <p className="text-sm text-gray-500 mt-1">{isTenantView ? "You have not placed any bids yet." : "No bids have been received for your listings."}</p>
         </div>
      )}
    </div>
  );
};

export default ManageBidsPage;