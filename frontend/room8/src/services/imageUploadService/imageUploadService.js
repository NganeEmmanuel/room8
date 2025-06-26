import {toast} from "react-toastify";

export async function uploadImageToS3(base64Image) {
    try {
        const res = await fetch(base64Image);
        const blob = await res.blob();
        console.log("Blob:", blob);
        console.log("Type:", blob.type);
        const fileType = blob.type;
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileType.split('/')[1]}`;
        const uploadUrl = `https://room8-profile-imge-bucket.s3.amazonaws.com/${fileName}`;

        await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': fileType
            },
            body: blob
        });

        return uploadUrl;
    } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image.");
        throw error;
    }
}
