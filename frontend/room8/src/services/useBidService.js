// src/services/useBidService.js

import { useCallback } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { withRetry } from '../utils/retryUtils';
import { useAuthService } from './authService/AuthService';
import { getAccessToken } from '../utils/tokenUtils';
import { useAuth } from '../context/AuthContext';

const BID_BASE_URL =
  typeof window !== 'undefined' && window._env_?.VITE_AUTH_BASE_URL
    ? window._env_.VITE_AUTH_BASE_URL
    : import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8765';

const API_URL = `${BID_BASE_URL}/bid-service/api/v1/bids`;


export const useBidService = () => {
  const { refreshToken } = useAuthService();
  const { authDataState } = useAuth();
  const userId = authDataState.userInfo?.id; // Extract the stable user ID once

  const executeRequest = useCallback(async (apiCall) => {
    const callWithToken = async (accessToken) => {
      try {
        return await withRetry(() => apiCall(accessToken), 1, 500);
      } catch (err) {
        if (err.response?.status === 401) throw new Error('UNAUTHORIZED');
        throw err;
      }
    };

    try {
      return await callWithToken(getAccessToken());
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        try {
          const newAccessToken = await refreshToken();
          return await callWithToken(newAccessToken);
        } catch (refreshErr)          {
          toast.error(refreshErr.message || 'Your session has expired.');
          throw refreshErr;
        }
      }
      throw err;
    }
  }, [refreshToken]);

  const addBid = useCallback(async (bidData, listingId) => {
    if (!userId) throw new Error("User not authenticated.");
    const requestBidDTO = {
      listingId,
      bidderId: userId,
      proposal: bidData.proposal,
      isShareInfo: bidData.shareUserInfo
    };
    try {
      const response = await executeRequest(token =>
        apiClient.post(`${API_URL}/add-bid`, requestBidDTO, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      toast.success("Bid submitted successfully!");
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit bid.');
      throw err;
    }
  }, [userId, executeRequest]);

  const updateBid = useCallback(async (bidId, bidData, listingId) => {
    if (!userId) throw new Error("User not authenticated.");
    const requestBidDTO = {
      listingId,
      bidderId: userId,
      proposal: bidData.proposal,
      isShareInfo: bidData.shareUserInfo,
    };
    try {
      const response = await executeRequest(token =>
        apiClient.put(`${API_URL}/update-bid`, requestBidDTO, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id: bidId }
        })
      );
      toast.success("Bid updated successfully!");
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update bid.');
      throw err;
    }
  }, [userId, executeRequest]);

  const removeBid = useCallback(async (bidId) => {
    try {
      const response = await executeRequest(token =>
        apiClient.delete(`${API_URL}/remove-bid`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id: bidId }
        })
      );
      toast.success("Bid removed successfully!");
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove bid.');
      throw err;
    }
  }, [executeRequest]);

  const getBid = useCallback(async (bidId) => {
    try {
      const response = await executeRequest(token =>
        apiClient.get(`${API_URL}/get-bid`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id: bidId }
        })
      );
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch bid.');
      throw err;
    }
  }, [executeRequest]);

  const getBidsByListingId = useCallback(async (listingId) => {
    try {
      const response = await executeRequest(token =>
        apiClient.get(`${API_URL}/get-bids-by-listingId`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { listingId }
        })
      );
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch bids for this listing.');
      throw err;
    }
  }, [executeRequest]);

  /**
   * GET /get-bids-by-userId
   * Fetches all bids for the currently logged-in user.
   */
  const getMyBids = useCallback(async () => {
    if (!userId) {
      // Return a rejected promise or throw an error to be caught by the caller.
      throw new Error("User not authenticated.");
    }

      // eslint-disable-next-line no-useless-catch
    try {
      const response = await executeRequest(token =>
        apiClient.get(`${API_URL}/get-bids-by-userId`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId } // Use the stable userId variable
        })
      );
      return response.data;
    } catch (err) {
      // The error is already toasted by executeRequest on failure. Re-throw to let the component handle UI state.
      throw err;
    }
  }, [userId, executeRequest]); // <-- FIX: Dependency is now stable

  const updateBidStatus = useCallback(async (bidId, status) => {
    try {
      const response = await executeRequest(token =>
        apiClient.put(`${API_URL}/${bidId}/status`,
          { status: status.toUpperCase() }, // The request body
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      toast.success(`Bid status successfully updated to ${status}.`);
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update bid status.');
      throw err;
    }
  }, [executeRequest]);

  return {
    addBid,
    updateBid,
    removeBid,
    getBid,
    getBidsByListingId,
    getMyBids,
    updateBidStatus
  };
};
