import apiClient from '../../api/apiClient';
import { getAccessToken } from '../../utils/tokenUtils';

const BASE_URL = '/notification-service/api/v1/notifications';

export async function fetchNotifications(userId, refreshToken) {
  try {
    const tryRequest = async (token) => {
      return await apiClient.get(`${BASE_URL}?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };

    let accessToken = getAccessToken();
    try {
      const response = await tryRequest(accessToken);
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        const newToken = await refreshToken();
        if (!newToken) throw new Error("Session expired.");
        const response = await tryRequest(newToken);
        return response.data;
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Error fetching notifications", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId, userId, refreshToken) {
  try {
    const tryRequest = async (token) => {
      return await apiClient.post(`${BASE_URL}/${notificationId}/read?userId=${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };

    let accessToken = getAccessToken();
    try {
      await tryRequest(accessToken);
    } catch (err) {
      if (err.response?.status === 401) {
        const newToken = await refreshToken();
        if (!newToken) throw new Error("Session expired.");
        await tryRequest(newToken);
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Error marking notification as read", error);
  }
}
