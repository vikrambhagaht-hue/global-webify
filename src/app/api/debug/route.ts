import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const services = await db.servicePage.findMany({ select: { slug: true, title: true } });
  return NextResponse.json(services);
}
