import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/auth';

// Configure Cloudinary (Will only be used if env vars exist)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the request
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // 2. File Validation (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, message: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.doc', '.docx', '.mp4'];
    
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ success: false, message: `File type not allowed.` }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    
    let finalExt = ext;
    const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9.-_]/g, '-').replace(/-+/g, '-');
    let baseFilename = sanitizedOriginalName.substring(0, sanitizedOriginalName.lastIndexOf('.')) || sanitizedOriginalName;

    // Automatic Image Compression & Conversion to WebP
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (imageExtensions.includes(ext)) {
      try {
        const processedBuffer = await sharp(buffer)
          .resize({ width: 1920, withoutEnlargement: true }) // Prevent massive dimensions
          .webp({ quality: 80 }) // 80% quality retains excellent visuals but drastically reduces size
          .toBuffer();
        buffer = Buffer.from(processedBuffer);
        finalExt = '.webp';
      } catch (err) {
        console.error('Image compression failed, falling back to original:', err);
      }
    }

    // HOSTINGER DEPLOYMENT: If we are using local storage (never on Vercel — its filesystem is read-only)
    if (process.env.STORAGE_PROVIDER === 'local' && !process.env.VERCEL) {
      const filename = `${Date.now()}-${baseFilename}${finalExt}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      try { await mkdir(uploadDir, { recursive: true }); } catch (err) {}
      
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    }

    // VERCEL DEPLOYMENT: Fallback to Cloudinary because Vercel doesn't allow local file saving
    const result: any = await new Promise((resolve, reject) => {
      // Strip extension properly (ext already includes the dot, e.g. '.webp')
      let baseName = originalName
        .replace(new RegExp(`\\${ext}$`, 'i'), '')  // Remove file extension
        .replace(/\s+/g, '-')                       // Spaces → dashes
        .replace(/[^a-zA-Z0-9\-_]/g, '')            // Remove commas, dots, and all special chars (commas break Cloudinary URLs!)
        .replace(/-+/g, '-')                         // Collapse multiple dashes
        .replace(/^-|-$/g, '');                      // Trim leading/trailing dashes
      
      // CRITICAL: Truncate filename to 30 chars max!
      // The Cloudinary URL prefix is ~80 chars, timestamp adds ~13, folder adds ~25.
      // MySQL VARCHAR(191) silently chops anything longer, breaking the image URL!
      baseName = baseName.substring(0, 30).replace(/-$/, '');
      
      const isVideo = ['.mp4', '.webm', '.ogg'].includes(ext);
      
      const uploadOptions: any = { 
        folder: 'global-weblify/uploads',
        resource_type: 'image',
        public_id: `${baseName}-${Date.now()}.webp`
      };

      if (!isVideo) {
        // We DO NOT set uploadOptions.format or transformations here! 
        // Setting them forces Cloudinary into asynchronous processing on free tiers, 
        // which returns a URL before the image actually exists (causing the 404 broken image).
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, url: result.secure_url });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error during upload' }, { status: 500 });
  }
}

