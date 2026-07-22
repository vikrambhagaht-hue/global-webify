import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const videoPath = path.join(process.cwd(), 'public', 'videoplayback.mp4');
    
    if (!fs.existsSync(videoPath)) {
      return new NextResponse("Video not found", { status: 404 });
    }
    
    const stat = fs.statSync(videoPath);
    const stream = fs.createReadStream(videoPath);
    
    // We send it as octet-stream so aggressive download managers like IDM don't intercept it
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size.toString(),
      }
    });
  } catch (error) {
    console.error("Error serving video:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
