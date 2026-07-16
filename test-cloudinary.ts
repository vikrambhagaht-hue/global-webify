import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  try {
    // 1x1 transparent WebP base64
    const b64 = "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
    const buffer = Buffer.from(b64, 'base64');
    
    console.log("Uploading test image...");
    const result = await new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: 'global-weblify/uploads',
        resource_type: 'auto',
        public_id: `test-image-${Date.now()}`,
        format: 'webp'
      };
      
      const stream = cloudinary.uploader.upload_stream(uploadOptions as any, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
      stream.end(buffer);
    });
    
    console.log("Upload success! URL:", (result as any).secure_url);
    
    // Fetch it to see if it 404s
    const res = await fetch((result as any).secure_url);
    console.log("Fetch Status:", res.status, res.statusText);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
