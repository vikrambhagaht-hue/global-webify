import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  daysToShow: 10,
  blockedDates: [],
  blockedTimes: []
};

export async function GET() {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: 'partnership_availability' }
    });

    if (!setting) {
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
    }

    return NextResponse.json({ success: true, settings: JSON.parse(setting.value) });
  } catch (error) {
    console.error('Error fetching availability settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    // Validate and sanitize the data structure
    const settings = {
      daysToShow: typeof data.daysToShow === 'number' ? data.daysToShow : 10,
      blockedDates: Array.isArray(data.blockedDates) ? data.blockedDates : [],
      blockedTimes: Array.isArray(data.blockedTimes) ? data.blockedTimes : []
    };

    const valueStr = JSON.stringify(settings);

    await db.siteSetting.upsert({
      where: { key: 'partnership_availability' },
      update: { value: valueStr },
      create: { key: 'partnership_availability', value: valueStr }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving availability settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
}
