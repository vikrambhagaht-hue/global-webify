import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const fileUrl = req.nextUrl.searchParams.get('url');

  if (!fileUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    await requireAdmin();
  } catch (authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mimeMap: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };

  try {
    let fileBuffer: Buffer;
    let ext: string;

    // Local file (e.g. /uploads/filename.pdf) — used on Hostinger with STORAGE_PROVIDER=local
    if (fileUrl.startsWith('/')) {
      // Prevent path traversal
      const normalizedUrl = path.normalize(fileUrl).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(process.cwd(), 'public', normalizedUrl);
      
      // Double check that it's actually in the public directory
      const publicDir = path.join(process.cwd(), 'public');
      if (!filePath.startsWith(publicDir)) {
        return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
      }

      fileBuffer = await readFile(filePath);
      ext = path.extname(filePath).toLowerCase();
    } else {
      // SSRF Protection: Only allow whitelisted domains
      const allowedDomains = ['res.cloudinary.com', 'images.unsplash.com', 'globalwebify.com', 'www.globalwebify.com'];
      try {
        const urlObj = new URL(fileUrl);
        if (!allowedDomains.some(d => urlObj.hostname === d || urlObj.hostname.endsWith('.' + d))) {
          return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
        }
        // Block private/internal IPs
        if (/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|0\.|169\.254\.|localhost)/i.test(urlObj.hostname)) {
          return NextResponse.json({ error: 'Internal addresses not allowed' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
      }

      // Remote URL (Cloudinary or any other host) — proxy fetch
      const response = await fetch(fileUrl);
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch file' }, { status: 502 });
      }
      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      ext = path.extname(new URL(fileUrl).pathname).toLowerCase();
    }

    const contentType = mimeMap[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Content-Disposition': 'inline',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Preview file error:', error);
    return NextResponse.json({ error: 'Failed to load file' }, { status: 500 });
  }
}
