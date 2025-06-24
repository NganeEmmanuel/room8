// src/services/useListingService.js

import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { getAccessToken } from '../utils/tokenUtils';
import { useAuthService } from './authService/AuthService';
import { useAuth } from '../context/AuthContext';
import { withRetry } from '../utils/retryUtils'; // Import the retry utility
import { uploadImages } from './S3Service';

const ROOM_SERVICE_URL =
  typeof window !== 'undefined' && window._env_?.VITE_ROOM_SERVICE_BASE_URL
    ? window._env_.VITE_ROOM_SERVICE_BASE_URL
    : import.meta.env.VITE_ROOM_SERVICE_BASE_URL || 'http://localhost:8765';

const API_BASE_URL = `${ROOM_SERVICE_URL}/room-service/api/v1/listings`;

export const useListingService = () => {
  const { refreshToken } = useAuthService();
  const { authDataState } = useAuth();

  const createListing = async (listingData) => {
    const { userInfo } = authDataState;
    if (!userInfo || !userInfo.id) {
      const errorMsg = "User information is not available. Cannot create listing.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    const createWithToken = async (accessToken) => {
      try {
        const imageUrls = await uploadImages(listingData.images, userInfo.id);
        const listingDTO = {
          landlordId: userInfo.id,
          title: listingData.listingTitle,
          listingDescription: listingData.listingDescription,
          listingPrice: parseFloat(listingData.listingPrice),
          imageUrls: imageUrls,


        // --- Location ---
        listingCountry: listingData.listingCountry,
        listingState: listingData.listingState,
        listingCity: listingData.listingCity,
        listingStreet: listingData.listingStreet,

        // --- Property Details ---
        listingType: listingData.listingType,
        listingStyle: listingData.listingStyle,
        numberOfRooms: parseInt(listingData.numberOfRooms, 10),
        roomArea: parseFloat(listingData.roomArea),

        // --- Bathroom Details ---
        numberOfBathrooms: parseInt(listingData.numberOfBathrooms, 10),
        isSharedBathroom: listingData.isSharedBathroom || false,
        bathroomArea: parseFloat(listingData.bathroomArea) || 0,
        bathroomLocation: listingData.bathroomLocation,

        // --- Kitchen Details ---
        numberOfKitchens: parseInt(listingData.numberOfKitchens, 10),
        isSharedKitchen: listingData.isSharedKitchen || false,
        kitchenArea: parseFloat(listingData.kitchenArea) || 0,

        // --- Household ---
        numberOfHouseMates: parseInt(listingData.numberOfHouseMates, 10),


         hasLivingRoom: listingData.hasLivingRoom || false,
         numberOfLivingRooms: parseInt(listingData.numberOfLivingRooms, 10) || 0,
         livingRoomArea: parseFloat(listingData.livingRoomArea) || 0,
        };

        // Using withRetry on the API call, as requested
        const res = await withRetry(() =>
          apiClient.post(`${API_BASE_URL}/add`, listingDTO, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }), 1, 1000 // Retry once after 1 second on network failure
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) throw new Error('UNAUTHORIZED');
        throw err;
      }
    };

    try {
      const accessToken = getAccessToken();
      const result = await createWithToken(accessToken);
      toast.success("Listing created successfully!");
      return result;
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        try {
          const newAccessToken = await refreshToken();
          const result = await createWithToken(newAccessToken);
          toast.success("Listing created successfully!");
          return result;
        } catch (refreshErr) {
          toast.error(refreshErr.message || 'Session expired. Please login again.');
          throw refreshErr;
        }
      }
      toast.error(err.response?.data?.message || err.message || 'Failed to create listing.');
      throw err;
    }
  };

  const getMyListings = async ({ start = 0, limit = 10 } = {}) => {
    const { userInfo } = authDataState;
    if (!userInfo) return [];

    const fetchWithToken = async (accessToken) => {
      try {
        const getListingRequest = { landlordId: userInfo.id, start, limit };

        // Using withRetry on the API call, as requested
        const res = await withRetry(() =>
          apiClient.post(`${API_BASE_URL}/get/listings`, getListingRequest, {
           headers: { Authorization: `Bearer ${accessToken}` },
          }), 1, 1000
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) throw new Error('UNAUTHORIZED');
        if (err.response?.status === 404) return [];
        throw err;
      }
    };

    try {
      const accessToken = getAccessToken();
      return await fetchWithToken(accessToken);
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        try {
          const newAccessToken = await refreshToken();
          return await fetchWithToken(newAccessToken);
        } catch (refreshErr) {
          toast.error(refreshErr.message || 'Session expired. Please login again.');
          throw refreshErr;
        }
      }
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch listings.');
      throw err;
    }
  };
   const updateListing = async (listingData) => {
    const { userInfo } = authDataState;
    if (!userInfo || !userInfo.id) {
      throw new Error('User is not authenticated.');
    }

    const updateWithToken = async (accessToken) => {
      try {
        // Separate existing image URLs from new image Files
        const keptImageUrls = listingData.images.filter(img => typeof img === 'string');
        const newImageFiles = listingData.images.filter(img => img instanceof File);

        // Upload only the new files
        const newImageUrls = await uploadImages(newImageFiles, userInfo.id);

        // BUGFIX: Combine both old and new image URLs for the final DTO
        const allImageUrls = [...keptImageUrls, ...newImageUrls];

        const listingDTO = {
            id: listingData.id,
            landlordId: userInfo.id,
            title: listingData.listingTitle,
            listingDescription: listingData.listingDescription,
            listingPrice: parseFloat(listingData.listingPrice),
            imageUrls: allImageUrls,
            listingCountry: listingData.listingCountry,
        listingState: listingData.listingState,
        listingCity: listingData.listingCity,
        listingStreet: listingData.listingStreet,

        // --- Property Details ---
        listingType: listingData.listingType,
        listingStyle: listingData.listingStyle,
        numberOfRooms: parseInt(listingData.numberOfRooms, 10),
        roomArea: parseFloat(listingData.roomArea),

        // --- Bathroom Details ---
        numberOfBathrooms: parseInt(listingData.numberOfBathrooms, 10),
        isSharedBathroom: listingData.isSharedBathroom || false,
        bathroomArea: parseFloat(listingData.bathroomArea) || 0,
        bathroomLocation: listingData.bathroomLocation,

        // --- Kitchen Details ---
        numberOfKitchens: parseInt(listingData.numberOfKitchens, 10),
        isSharedKitchen: listingData.isSharedKitchen || false,
        kitchenArea: parseFloat(listingData.kitchenArea) || 0,

        // --- Household ---
        numberOfHouseMates: parseInt(listingData.numberOfHouseMates, 10),


         hasLivingRoom: listingData.hasLivingRoom || false,
         numberOfLivingRooms: parseInt(listingData.numberOfLivingRooms, 10) || 0,
         livingRoomArea: parseFloat(listingData.livingRoomArea) || 0,

        };

        const res = await withRetry(() =>
          apiClient.put(`${API_BASE_URL}/update/listing`, listingDTO, {
            headers: { Authorization: `Bearer ${accessToken}` }
          }), 1, 1000
        );
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) throw new Error('UNAUTHORIZED');
        throw err;
      }
    };

    try {
      const accessToken = getAccessToken();
      const result = await updateWithToken(accessToken);
      toast.success("Listing updated successfully!");
      return result;
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        try {
          const newAccessToken = await refreshToken();
          const result = await updateWithToken(newAccessToken);
          toast.success("Listing updated successfully!");
          return result;
        } catch (refreshErr) {
          toast.error(refreshErr.message || 'Session expired.');
          throw refreshErr;
        }
      }
      toast.error(err.response?.data?.message || 'Failed to update listing.');
      throw err;
    }
  };

  const deleteListing = async (listingId, listingType) => {
    const deleteWithToken = async (accessToken) => {
      try {
        await withRetry(() =>
          apiClient.delete(`${API_BASE_URL}/delete/listing`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            data: { roomId: listingId, listingType: listingType } // Keep body in DELETE request
          }), 1, 1000
        );
      } catch (err) {
        if (err.response?.status === 401) throw new Error('UNAUTHORIZED');
        throw err;
      }
    };

    try {
      await deleteWithToken(getAccessToken());
      // The toast is handled in the component for a better user experience
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        try {
          const newAccessToken = await refreshToken();
          await deleteWithToken(newAccessToken);
        } catch (refreshErr) {
          toast.error(refreshErr.message || 'Session expired.');
          throw refreshErr;
        }
      } else {
        toast.error(err.response?.data?.message || 'Failed to delete listing.');
        throw err;
      }
    }
  };

  return { createListing, getMyListings, updateListing, deleteListing };
};


