// src/services/listingService/ListingService.js

import { toast } from 'react-toastify';
import apiClient from '../api/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useAuthService } from './authService/AuthService.js';
import { uploadImages } from './S3Service.js';
import {getAccessToken} from "../utils/tokenUtils.js"; // Assuming S3Service is in a path like this

// This should match the base URL of your room-service
const ROOM_SERVICE_URL =
    typeof window !== 'undefined' && window._env_?.VITE_ROOM_SERVICE_BASE_URL
    ? window._env_.VITE_ROOM_SERVICE_BASE_URL
    : import.meta.env.VITE_ROOM_SERVICE_BASE_URL || 'http://localhost:8765'; //  port for api gateway service

const API_BASE_URL = `${ROOM_SERVICE_URL}/room-service/api/v1/listings`;

export const useListingService = () => {
    const { authDataState } = useAuth();
    const { userInfo } = authDataState;
    const { refreshToken } = useAuthService();

    /**
     * A generic function to execute API calls and handle token refresh logic.
     * @param {Function} apiCall - The function that makes the actual API request.
     * @returns The response data from the API call.
     */
    const callApiWithAuthRefresh = async (apiCall) => {
        try {
            return await apiCall(getAccessToken());
        } catch (error) {
            if (error.response?.status === 401 || error.message === 'UNAUTHORIZED') {
                console.log('Access token expired, refreshing...');
                try {
                    const newAccessToken = await refreshToken(); // Refreshes token and updates context
                    return await apiCall(newAccessToken); // Retry the original call with the new token
                } catch (refreshError) {
                    toast.error('Your session has expired. Please log in again.');
                    // Consider redirecting to login page here
                    throw refreshError;
                }
            }
            throw error; // Re-throw other errors
        }
    };

    /**
     * Creates a new listing. It first uploads images to S3,
     * then sends the listing data with image URLs to the backend.
     * @param {object} listingData - The form data for the new listing.
     * @returns {object} The created listing data from the backend.
     */
    const createListing = async (listingData) => {
    if (!userInfo || !userInfo.id) {
        throw new Error('User is not authenticated.');
    }

    // 1. Upload images to S3
    const imageUrls = await uploadImages(listingData.images,userInfo.id);

    // 2. Prepare the JavaScript object to match the backend ListingDTO
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

    // 3. Make the API call
    const apiCall = (token) => apiClient.post(`${API_BASE_URL}/add`, listingDTO, {
        headers: { Authorization: `Bearer ${token}` }
    });

    try {
        const response = await callApiWithAuthRefresh(apiCall);
        toast.success("Listing created successfully!");
        return response.data;
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create listing.');
        throw err;
    }
};

            const getMyListings = async ({ start = 0, limit = 10 } = {}) => {
        if (!userInfo || !userInfo.id) {
            // This can happen if the page loads before the user context is ready.
            // We can either throw an error or wait. For now, we'll stop here.
            toast.warn("User data not ready, please wait a moment.");
            throw new Error('User is not authenticated or userInfo is not yet available.');
        }

        const getListingRequest = {
            landlordId: userInfo.id,
            start: start,
            limit: limit,
        };

        // --- FIX #2: The structure for apiClient.post is (url, data, config) ---
        const apiCall = (token) => apiClient.post(
            `${API_BASE_URL}/get/listings`,
            getListingRequest, // The data goes here as the second argument
            {
                headers: { Authorization: `Bearer ${token}` } // The config (headers) goes here
            }
        );

        try {
            const response = await callApiWithAuthRefresh(apiCall);
            return response.data;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                 toast.info("You haven't created any listings yet.");
                 return [];
            }
            toast.error(err.response?.data?.message || "Failed to fetch your listings.");
            throw err;
        }
    };



    const deleteListing = async (listingId, listingType) => {
        const apiCall = (token) => apiClient.delete(`${API_BASE_URL}/delete/listing`, {
             headers: { Authorization: `Bearer ${token}` },

             data: { roomId: listingId, listingType: listingType }
        });

        try {
            await callApiWithAuthRefresh(apiCall);
            toast.success("Listing deleted successfully!");
        } catch (err) {
             toast.error(err.response?.data?.message || err.message || 'Failed to delete listing.');
             throw err;
        }
    };

    const getListingById = async (listingId, listingType) => {
    if (!listingId || !listingType) {
        throw new Error("Listing ID and Type are required to fetch details.");
    }

    // This matches the `ListingRequest` DTO on your backend
    const listingRequest = {
        roomId: listingId, // Your backend DTO uses 'roomId' for this specific request
        listingType: listingType,
    };

    // This calls your singular GET endpoint: /get/listing
    // and sends the body using the 'data' property, which Axios requires for GET requests.
    const apiCall = (token) => apiClient.get(`${API_BASE_URL}/get/listing`, {
        headers: { Authorization: `Bearer ${token}` },
        data: listingRequest
    });

    try {
        const response = await callApiWithAuthRefresh(apiCall);
        return response.data;
    } catch (err) {
        // We let the EditListingPage handle the toast for this specific error
        console.error("Failed to fetch listing by ID", err);
        throw err;
    }
};



    // UPDATE
    const updateListing = async (listingData) => {
        if (!userInfo || !userInfo.id) {
            throw new Error('User is not authenticated.');
        }

          // --- START OF FIX ---

 
    // `listingData.images` is now the combined array we created.
    const keptImageUrls = listingData.images.filter(img => typeof img === 'string');
    const newImageFiles = listingData.images.filter(img => img instanceof File);

    // This logic remains the same and will now work correctly!
    const newImageUrls = await uploadImages(newImageFiles, userInfo.id);
    const allImageUrls = [...keptImageUrls, ...newImageUrls];


        // Construct the DTO for the backend
        const listingDTO = {
            id: listingData.id, // The ID of the listing to update
            landlordId: userInfo.id,
            title: listingData.listingTitle,
            listingDescription: listingData.listingDescription,
            listingPrice: parseFloat(listingData.listingPrice),
            imageUrls: newImageUrls,
            listingCountry: listingData.listingCountry,
            listingState: listingData.listingState,
            listingCity: listingData.listingCity,
            listingStreet: listingData.listingStreet,
            listingType: listingData.listingType,
            listingStyle: listingData.listingStyle,
            numberOfRooms: parseInt(listingData.numberOfRooms, 10),
            roomArea: parseFloat(listingData.roomArea),
            numberOfBathrooms: parseInt(listingData.numberOfBathrooms, 10),
            isSharedBathroom: listingData.isSharedBathroom,
            bathroomArea: parseFloat(listingData.bathroomArea),
            bathroomLocation: listingData.bathroomLocation,
            numberOfKitchens: parseInt(listingData.numberOfKitchens, 10),
            isSharedKitchen: listingData.isSharedKitchen,
            kitchenArea: parseFloat(listingData.kitchenArea),
            numberOfHouseMates: parseInt(listingData.numberOfHouseMates, 10),
            hasLivingRoom: listingData.hasLivingRoom,
            numberOfLivingRooms: parseInt(listingData.numberOfLivingRooms, 10),
            livingRoomArea: parseFloat(listingData.livingRoomArea),
        };

        const apiCall = (token) => apiClient.put(`${API_BASE_URL}/update/listing`, listingDTO, {
            headers: { Authorization: `Bearer ${token}` }
        });

        try {
            const response = await callApiWithAuthRefresh(apiCall);
            toast.success("Listing updated successfully!");
            return response.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update listing.');
            throw err;
        }
    };


    return {
        createListing,
        getMyListings,
        deleteListing,
        updateListing

    };
};