import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Prisma requires the Node.js runtime (not Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// This endpoint is called by middleware to fetch redirects.
// It bypasses the middleware redirect check (since paths under /api
// are excluded from the redirect logic in middleware).
export async function GET() {
  try {
    const redirects = await db.redirect.findMany({
      select: { source: true, destination: true },
      take: 1000
    });
    return NextResponse.json(redirects);
  } catch (error) {
    // If DB fails, return empty array so middleware doesn't break
    return NextResponse.json([], { status: 200 });
  }
}
