import React, { createContext, useState, useContext } from 'react';

// The initial mock data will now live here
const initialBidsData = [
  {
    id: "bidTenant1",
    ListingId: "101",
    listingTitle: "Luxury Downtown Apartment",
    bidderId: "userYouTenant",
    landlordId: "landlordPrestige",
    landlordName: "Prestige Rentals",
    proposal: "This is my proposal for the downtown apartment.",
    amount: 75000,
    currency: "FCFA",
    status: "pending",
    bidDate: "2025-06-10T11:00:00Z",
    shareUserInfo: true,
    bidderInfo: { name: "You (Tenant)", email: "tenant@example.com", phoneNumber: "555-123-4567", profileImage: "https://i.pravatar.cc/150?u=tenantYou",
        userInfo:
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
    landlordId: "landlordMain",
    landlordName: "You (Landlord)",
    proposal: "I am a quiet professional, non-smoker, and have excellent references.",
    amount: 45000,
    currency: "FCFA",
    status: "pending",
    bidDate: "2025-06-12T14:30:00Z",
    shareUserInfo: true,
    bidderInfo: { name: "Alex P.", email: "alex.p@example.com", phoneNumber: "111-222-3333", profileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
        userInfo:
           { occupation: 'Software Engineer', employmentStatus: 'Employed', nationality: 'Canadian', languagesSpoken: ['English', 'French'],
             smokingStatus: 'Non-smoker', addictionStatus: 'None', hasPets: false, petPreference: 'None', petsAllowed: [], dietaryRestrictions: 'None',
             otherDietaryRestrictions: [], cleanlinessLevel: 'Very Tidy', sleepSchedule: 'Early Bird', comfortableWithGuests: 'Yes, with notice', partyHabits: 'Rarely', sharesFood: 'Sometimes, please ask',
             preferredRoomTemperature: 'Moderate', willingToShareBathroom: true, hasMedicalConditions: true, medicalConditions: ['Pollen Allergy'], isDisabled: false,
             disability: 'None', personalityType: 'Introvert', noiseTolerance: 'Prefers quiet', enjoysSocializingWithRoommates: 'Occasionally', willingToSplitUtilities: true,
            monthlyIncome: 6000, incomeCurrency: 'FCFA',
           } }
  }
];

const BidsContext = createContext();

export const BidsProvider = ({ children }) => {
  const [bids, setBids] = useState(initialBidsData);

  const addBid = (newBidData) => {
    setBids(prevBids => [newBidData, ...prevBids]);
  };

   // NEW FUNCTION: To update the sharing status of a bid
  const updateBidSharing = (bidId, newSharingStatus) => {
    setBids(prevBids =>
      prevBids.map(bid =>
        bid.id === bidId
          ? { ...bid, shareUserInfo: newSharingStatus }
          : bid
      )
    );
  };

  return (
    <BidsContext.Provider value={{ bids, addBid, updateBidSharing }}>
      {children}
    </BidsContext.Provider>
  );
};

// Custom hook to easily use the context
export const useBids = () => {
  return useContext(BidsContext);
};