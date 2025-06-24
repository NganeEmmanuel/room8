// src/services/S3Service.js
import { toast } from 'react-toastify';

// ✅ Replace this with your actual bucket name
const BUCKET_NAME = 'room8-listing-image-bucket';

export async function uploadFileToS3(file, userId) {
    const fileExtension = file.type.split('/')[1];
    const fileName = `listings/${userId}/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExtension}`;
    const uploadUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    try {
        const res = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file
        });

        if (!res.ok) throw new Error("Upload failed");

        return uploadUrl;
    } catch (err) {
        console.error('Image upload failed:', err);
        toast.error("Image upload failed.");
        throw err;
    }
}

export async function uploadImages(files, userId) {
    if (!files || files.length === 0) return [];

    const toastId = toast.loading(`Uploading ${files.length} image(s)...`);

    try {
        const uploadPromises = files.map(file => uploadFileToS3(file, userId));
        const urls = await Promise.all(uploadPromises);
        toast.update(toastId, { render: "Images uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
        return urls;
    } catch (err) {
        toast.update(toastId, { render: "Upload failed.", type: "error", isLoading: false, autoClose: 4000 });
        throw err;
    }
}
