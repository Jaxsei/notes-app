import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
/**
 * Uploads a file buffer to Cloudinary
 * @param fileBuffer - The image file buffer
 * @param filename - Optional file name (defaults to 'avatar')
 * @returns Promise resolving to Cloudinary upload result
 */
export const uploadOnCloudinary = (fileBuffer, filename = 'avatar') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            public_id: `avatars/${filename}`,
            folder: 'avatars'
        }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject(new Error('Upload failed: No result'));
            resolve(result);
        });
        Readable.from(fileBuffer).pipe(uploadStream);
    });
};
//# sourceMappingURL=cloudinary.js.map