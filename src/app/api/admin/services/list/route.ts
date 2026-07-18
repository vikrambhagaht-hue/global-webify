import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const services = await db.servicePage.findMany({
      select: {
        slug: true,
        title: true,
      },
      orderBy: {
        title: 'asc'
      }
    });

    return NextResponse.json({ services });
  } catch (error: any) {
    console.error('API List Services Error');
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
