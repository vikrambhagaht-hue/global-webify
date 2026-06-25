import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

// Prisma requires the Node.js runtime (not Edge)
export const runtime = 'nodejs';

const getCachedRedirects = unstable_cache(
  async () => {
    return await db.redirect.findMany({
      select: { source: true, destination: true },
      take: 1000
    });
  },
  ['all-redirects'],
  { tags: ['redirects'] }
);

// This endpoint is called by middleware to fetch redirects.
export async function GET() {
  try {
    const redirects = await getCachedRedirects();
    return NextResponse.json(redirects);
  } catch (error) {
    // If DB fails, return empty array so middleware doesn't break
    return NextResponse.json([], { status: 200 });
  }
}
