// src/services/userInfoService/userInfoService.js

import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';
import { getAccessToken } from '../../utils/tokenUtils';
import { isImageChanged } from '../../utils/imageUtils';
import { uploadImageToS3 } from '../imageUploadService/imageUploadService';

const USER_INFO_UPDATE_ENDPOINT = 'user-service/api/v1/user/user-info/update';

/**
 * Updates user info (and uploads image if changed).
 *
 * @param {Object} userData - new form values
 * @param {Object} originalData - initial values (used to detect image change)
 * @param {Function} refreshToken - async function to refresh token
 */
export async function updateUserInfo(userData, originalData, refreshToken) {
    try {
        let accessToken = getAccessToken();

        console.log("Imagepath: "+userData.profileImagePath)
        console.log("OriginalImagepath: "+originalData.profileImagePath)
        // Check for image change and upload
        if (isImageChanged(originalData.profileImagePath, userData.profileImagePath)) {
            console.log("call isImagechange true ... ")
            const uploadUrl = await uploadImageToS3(userData.profileImagePath);
            console.log("newImagepath: "+uploadUrl)
            userData.profileImagePath = uploadUrl;
        }

        const tryRequest = async (token) => {
            return await apiClient.put(USER_INFO_UPDATE_ENDPOINT, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
        };

        let response;
        try {
            response = await tryRequest(accessToken);
        } catch (err) {
            if (err.response?.status === 401) {
                const newToken = await refreshToken();
                if (!newToken) throw new Error("Session expired. Please login again.");
                response = await tryRequest(newToken);
            } else {
                throw err;
            }
        }

        toast.success("✅ Profile updated successfully!");
        return response.data;

    } catch (error) {
        console.error('❌ Error updating user info:', error);
        toast.error(error.message || "Failed to update profile.");
        throw error;
    }
}
