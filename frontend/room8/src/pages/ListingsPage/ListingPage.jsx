import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../../components/ListingCard/ListingCard';
import house1 from '../../assets/images/house1.png';
import house2 from '../../assets/images/house2.png';
import house3 from '../../assets/images/house3.png';

const dummyListings = [
  {
    id: 'abc123',
    title: 'Spacious 2-Bedroom Apartment',
    location: 'Yaounde, Bastos',
    price: '450,000 FCFA',
    image: house1,
    roomType: 'Private',
    isWishlisted: false,
    toilets: 2,
    kitchen: 1,
    roommates: 1,
    rooms: 2,
    size: '100sqm',
  },
  {
    id: 'def456',
    title: 'Cozy Shared Room in Preventive Street',
    location: 'Buea, Preventive Street',
    price: '150,000 FCFA',
    image: house2,
    roomType: 'Shared',
    isWishlisted: false,
    toilets: 1,
    kitchen: 1,
    roommates: 3,
    rooms: 1,
    size: '45sqm',
  },
  {
    id: 'ghi789',
    title: 'Modern Studio Apartment',
    location: 'Douala, Bonadjo',
    price: '250,000 FCFA',
    image: house3,
    roomType: 'Private',
    isWishlisted: false,
    toilets: 1,
    kitchen: 1,
    roommates: 0,
    rooms: 1,
    size: '60sqm',
  },
  {
    id: 'abc123',
    title: 'Spacious 2-Bedroom Apartment',
    location: 'Yaounde, Bastos',
    price: '450,000 FCFA',
    image: house1,
    roomType: 'Private',
    isWishlisted: false,
    toilets: 2,
    kitchen: 1,
    roommates: 1,
    rooms: 2,
    size: '100sqm',
  },
  {
    id: 'def456',
    title: 'Cozy Shared Room in Preventive Street',
    location: 'Buea, Preventive Street',
    price: '150,000 FCFA',
    image: house2,
    roomType: 'Shared',
    isWishlisted: false,
    toilets: 1,
    kitchen: 1,
    roommates: 3,
    rooms: 1,
    size: '45sqm',
  },
  {
    id: 'ghi789',
    title: 'Modern Studio Apartment',
    location: 'Douala, Bonadjo',
    price: '250,000 FCFA',
    image: house3,
    roomType: 'Private',
    isWishlisted: false,
    toilets: 1,
    kitchen: 1,
    roommates: 0,
    rooms: 1,
    size: '60sqm',
  },
  {
    id: 'abc123',
    title: 'Spacious 2-Bedroom Apartment',
    location: 'Yaounde, Bastos',
    price: '450,000 FCFA',
    image: house1,
    roomType: 'Private',
    isWishlisted: false,
    toilets: 2,
    kitchen: 1,
    roommates: 1,
    rooms: 2,
    size: '100sqm',
  },
  {
    id: 'def456',
    title: 'Cozy Shared Room in Preventive Street',
    location: 'Buea, Preventive Street',
    price: '150,000 FCFA',
    image: house2,
    roomType: 'Shared',
    isWishlisted: false,
    toilets: 1,
    kitchen: 1,
    roommates: 3,
    rooms: 1,
    size: '45sqm',
  },
  {
    id: 'ghi789',
    title: 'Modern Studio Apartment',
    location: 'Douala, Bonadjo',
    price: '250,000 FCFA',
    image: house3,
    roomType: 'Private',
    isWishlisted: false,
    toilets: 1,
    kitchen: 1,
    roommates: 0,
    rooms: 1,
    size: '60sqm',
  },
];

function ListingsPage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const handleWishlistClick = (listingId, isWishlisted) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      console.log(`${isWishlisted ? 'Removing from' : 'Adding to'} wishlist:`, listingId);
      // Add API toggle logic here
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listingId={listing.id}
            title={listing.title}
            location={listing.location}
            price={listing.price}
            image={listing.image}
            roomType={listing.roomType}
            isWishlisted={listing.isWishlisted}
            toilets={listing.toilets}
            kitchen={listing.kitchen}
            roommates={listing.roommates}
            rooms={listing.rooms}
            size={listing.size}
            onWishlistClick={handleWishlistClick}
          />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;
