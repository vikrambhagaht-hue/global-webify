import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// In-memory rate limiting (same pattern as contact route)
const ipRateLimit = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour
const RATE_LIMIT_MAX = 5;             // Max 5 applications per hour per IP
const MAX_MAP_SIZE = 10000;           // Safety cap — prevents unbounded growth
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // Purge expired entries every 10 minutes

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
    // Rate limiting: prevent spam bots from flooding with fake applications
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = req.headers.get('x-real-ip') || (forwardedFor ? forwardedFor.split(',')[0].trim() : req.ip) || 'unknown';
    if (checkRateLimit(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { name, email, phone, jobTitle, experience, resumeUrl, coverLetter, linkedin, portfolio } = await req.json();

    if (!name || !email || !phone || !jobTitle || !resumeUrl || !experience) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Check if candidate is currently locked out for this position
    const existing = await db.jobApplication.findFirst({
      where: {
        email,
        jobTitle,
        lockedUntil: {
          gt: new Date(),
        },
      },
    });

    if (existing) {
      const formattedDate = existing.lockedUntil 
        ? new Date(existing.lockedUntil).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        : 'later';
      return NextResponse.json({ 
        success: false, 
        error: `You have already applied for the "${jobTitle}" position. You will be eligible to reapply after ${formattedDate}.` 
      }, { status: 400 });
    }

    // 2. Fetch lock period configuration from settings (default to 30 days)
    const setting = await db.siteSetting.findUnique({
      where: { key: 'career_lock_days' },
    });
    const lockDays = setting ? parseInt(setting.value, 10) : 30;

    // 3. Compute lockedUntil date
    const lockedUntil = new Date();
    lockedUntil.setDate(lockedUntil.getDate() + lockDays);

    const application = await db.jobApplication.create({
      data: {
        name,
        email,
        phone,
        jobTitle,
        experience,
        resumeUrl,
        coverLetter: coverLetter || null,
        linkedin: linkedin || null,
        portfolio: portfolio || null,
        lockedUntil,
      },
    });

    return NextResponse.json({ success: true, id: application.id });
  } catch (error: any) {
    console.error('Job Application error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
