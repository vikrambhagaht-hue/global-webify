import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// In-memory rate limiting map
const ipRateLimit = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX = 60;          // Max 60 errors per minute per IP
const MAX_MAP_SIZE = 10000;         // Safety cap
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
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    
    if (checkRateLimit(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const { message, stack, digest } = await req.json();

    // CRIT-3 Fix: Prevent DoS & Log Injection by truncating inputs
    // Normal errors won't exceed these limits, but hackers trying to fill the disk will be stopped.
    const safeMessage = typeof message === 'string' ? message.slice(0, 1000) : '';
    const safeStack = typeof stack === 'string' ? stack.slice(0, 3000) : '';
    const safeDigest = typeof digest === 'string' ? digest.slice(0, 500) : '';

    if (!safeMessage && !safeStack) {
      return NextResponse.json({ success: true }); // Silent ignore if no data
    }

    const logContent = `
=== ERROR REPORT ===
Time: ${new Date().toISOString()}
Message: ${safeMessage}
Digest: ${safeDigest}
Stack Trace:
${safeStack}
====================
`;

    const logFilePath = path.join(process.cwd(), 'error_log.txt');
    const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 MB limit
    
    if (fs.existsSync(logFilePath)) {
      const stats = fs.statSync(logFilePath);
      if (stats.size > MAX_LOG_SIZE) {
        // Clear the file if it exceeds the limit
        fs.writeFileSync(logFilePath, '=== LOG ROTATED due to size limit ===\n', 'utf8');
      }
    }

    fs.appendFileSync(logFilePath, logContent, 'utf8');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
