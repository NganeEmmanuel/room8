// src/services/useSearchService.js

import { useCallback } from 'react'; // <-- Import useCallback
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';
import { withRetry } from '../utils/retryUtils';

const SEARCH_BASE_URL =
  typeof window !== 'undefined' && window._env_?.VITE_AUTH_BASE_URL
    ? window._env_.VITE_AUTH_BASE_URL
    : import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8765';



export const useSearchService = () => {

  /**
   * Performs a simple search using a query and/or city.
   */
  // --- FIX: Wrap the function in useCallback ---
  const searchListings = useCallback(async ({ query = '', city = '', page = 0, size = 10 }) => {
    try {
      const response = await withRetry(() =>
        apiClient.get(`${SEARCH_BASE_URL}/search-service/api/v1/search`, {
          params: { query, city, page, size }
        }), 2, 500
      );
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed.');
      throw err;
    }
  }, []); // <-- Empty dependency array means this function is created only once.

  /**
   * Performs an advanced search using a filter object.
   */
  // --- FIX: Wrap this function in useCallback as well ---
  const searchListingsWithFilter = useCallback(async (filter, page = 0, size = 10) => {
    try {
      const response = await withRetry(() =>
        apiClient.post(`${SEARCH_BASE_URL}/search-service/api/v1/search/filter`, filter, {
          params: { page, size }
        }), 2, 500
      );
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Filter operation failed.');
      throw err;
    }
  }, []); // <-- Empty dependency array for stability.

  return { searchListings, searchListingsWithFilter };
};