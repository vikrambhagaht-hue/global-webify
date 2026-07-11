import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const submissions = await db.partnershipSubmission.findMany({
      where: {
        preferredDate: { not: null },
        preferredTime: { not: null },
      },
      select: {
        preferredDate: true,
        preferredTime: true,
      }
    });
    
    return NextResponse.json({ success: true, bookedSlots: submissions });
  } catch (error: any) {
    console.error('Error fetching booked slots:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch booked slots' }, { status: 500 });
  }
}
