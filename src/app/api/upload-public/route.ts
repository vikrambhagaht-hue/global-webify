import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Configure Cloudinary (Will only be used if env vars exist)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // 1. Strict File Type Validation (Only PDF, DOC, DOCX)
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    // Also check extension just to be safe
    const extension = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx'];

    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(extension)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid file type. Only PDF and DOC/DOCX files are allowed.' 
      }, { status: 400 });
    }

    // 2. Strict File Size Validation (Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        message: 'File size exceeds 10MB limit.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Upload Logic (Cloudinary or Local)
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      // Use Cloudinary
      return new Promise<NextResponse>((resolve) => {
        cloudinary.uploader.upload_stream(
          { folder: 'globalwebify_public_documents', resource_type: 'raw' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Public Upload Error:', error);
              resolve(NextResponse.json({ success: false, message: 'Failed to upload to Cloudinary' }, { status: 500 }));
            } else {
              resolve(NextResponse.json({ success: true, url: result?.secure_url }));
            }
          }
        ).end(buffer);
      });
    } else {
      // Fallback to local upload (public/uploads/documents)
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Directory might already exist
      }

      // Generate a secure, unique filename to prevent overwriting
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `doc-${uniqueSuffix}${extension}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      
      const fileUrl = `/uploads/documents/${filename}`;
      return NextResponse.json({ success: true, url: fileUrl });
    }
  } catch (error) {
    console.error('Public Upload API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
