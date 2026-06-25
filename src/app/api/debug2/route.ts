import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const redirects = await db.redirect.findMany({
      where: {
        source: '/web-development'
      }
    });

    return NextResponse.json({
      badRedirects: redirects
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
