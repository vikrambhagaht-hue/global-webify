import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

async function ensureTableExists() {
  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ContactSubmission (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NULL,
        service VARCHAR(255) NULL,
        message TEXT NOT NULL,
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
  } catch (e) {
    console.error('Failed to ensure ContactSubmission table exists:', e);
  }
}

// In-memory rate limiting map (works perfectly on persistent Node.js servers like Hostinger VPS)
const ipRateLimit = new Map<string, { count: number, resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimit.get(ip);
  if (!entry || entry.resetTime < now) {
    ipRateLimit.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 hour reset
    return false;
  }
  if (entry.count >= 5) { // Max 5 submissions per hour per IP
    return true;
  }
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    
    if (checkRateLimit(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { name, email, phone, service, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Spam Protection: Validate payload lengths to prevent DB overload
    if (name.length > 100 || email.length > 100 || (phone && phone.length > 20)) {
      return NextResponse.json({ success: false, error: 'Input exceeds maximum allowed length' }, { status: 400 });
    }
    if (message.length > 1500) {
      return NextResponse.json({ success: false, error: 'Message is too long (maximum 1500 characters)' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    // Spam Protection: Rate limit by email in DB (Max 3 per day)
    await ensureTableExists();
    const existingSubmissions = await db.$queryRawUnsafe<any[]>(
      `SELECT COUNT(*) as count FROM ContactSubmission WHERE email = ? AND createdAt > DATE_SUB(NOW(), INTERVAL 1 DAY)`,
      email
    );
    const count = Number(existingSubmissions[0].count || 0);
    if (count >= 3) {
      return NextResponse.json({ success: false, error: 'You have submitted too many requests today. Please try again tomorrow.' }, { status: 429 });
    }

    await db.$executeRawUnsafe(
      `INSERT INTO ContactSubmission (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)`,
      name,
      email,
      phone || null,
      service || null,
      message
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact submission POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await ensureTableExists();
    const submissions = await db.$queryRawUnsafe(
      `SELECT * FROM ContactSubmission ORDER BY createdAt DESC`
    );
    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    console.error('Contact submission GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid id parameter' }, { status: 400 });
    }

    await ensureTableExists();
    await db.$executeRawUnsafe(`DELETE FROM ContactSubmission WHERE id = ?`, id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact submission DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
