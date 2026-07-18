import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    // Manually alter the database columns to TEXT/VARCHAR(500) to fix the 191 character limit silent truncation!
    await db.$executeRaw`ALTER TABLE blogpost MODIFY image TEXT;`;
    await db.$executeRaw`ALTER TABLE blogpost MODIFY title VARCHAR(500);`;
    await db.$executeRaw`ALTER TABLE blogpost MODIFY slug VARCHAR(500);`;

    return NextResponse.json({ 
      success: true, 
      message: "Database columns upgraded successfully! The 191 character limit is gone." 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
