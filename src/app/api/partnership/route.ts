import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const ipRateLimit = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour
const RATE_LIMIT_MAX = 5;             // Max 5 submissions per hour per IP
const MAX_MAP_SIZE = 10000;           // Prevent memory leak
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  ipRateLimit.forEach((entry, ip) => {
    if (entry.resetTime < now) {
      ipRateLimit.delete(ip);
    }
  });
}

function checkRateLimit(ip: string): boolean {
  cleanupExpiredEntries();
  const now = Date.now();
  const entry = ipRateLimit.get(ip);
  if (!entry || entry.resetTime < now) {
    if (ipRateLimit.size >= MAX_MAP_SIZE && !entry) {
      return true;
    }
    ipRateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
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

    const { name, email, phone, companyName, websiteUrl, partnershipType, message } = await req.json();
    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (name.length > 100 || email.length > 100 || (phone && phone.length > 20)) {
      return NextResponse.json({ success: false, error: 'Input exceeds maximum allowed length' }, { status: 400 });
    }
    const msg = message || "";
    if (msg.length > 1500) {
      return NextResponse.json({ success: false, error: 'Message is too long (maximum 1500 characters)' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    // Email rate check (Max 3 per day)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await db.partnershipSubmission.count({
      where: { email, createdAt: { gt: yesterday } }
    });
    if (count >= 3) {
      return NextResponse.json({ success: false, error: 'You have submitted too many requests today. Please try again tomorrow.' }, { status: 429 });
    }

    await db.partnershipSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        companyName: companyName || null,
        websiteUrl: websiteUrl || null,
        partnershipType: partnershipType || null,
        message: msg
      }
    });

    // Send SMTP email notification in the background
    const mailSubject = `New Partnership Request: ${name}`;
    const mailContent = `
      <h2>New Partnership Proposal</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not Provided'}</p>
      <p><strong>Company:</strong> ${companyName || 'Not Provided'}</p>
      <p><strong>Website:</strong> ${websiteUrl || 'Not Provided'}</p>
      <p><strong>Partnership Type:</strong> ${partnershipType || 'General Partner'}</p>
      <p><strong>Proposal Message:</strong></p>
      <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; margin-top: 10px;">
        ${msg ? msg.replace(/\n/g, '<br>') : 'No message provided.'}
      </div>
      <br>
      <p>— Sent from Global Webify Lead Notifications</p>
    `;
    
    import('@/lib/mail').then(({ sendMailNotification }) => {
      sendMailNotification({ subject: mailSubject, htmlContent: mailContent }).catch(err => {
        console.error('SMTP send failure:', err);
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Partnership submission POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const submissions = await db.partnershipSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000
    });
    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    console.error('Partnership submission GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error. Please try again.' }, { status: 500 });
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
    if (idStr === 'all') {
      await db.partnershipSubmission.deleteMany({});
      return NextResponse.json({ success: true });
    }
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid id parameter' }, { status: 400 });
    }

    await db.partnershipSubmission.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Partnership submission DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
