import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';
import { generateCsrfToken } from '@/lib/csrf';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Get client IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = request.headers.get('x-real-ip') || (forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown');

    const lockoutTimeWindow = new Date(Date.now() - 15 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Cleanup old records to prevent unbounded table growth
    try {
      await db.loginAttempt.deleteMany({
        where: { timestamp: { lt: oneDayAgo } }
      });
    } catch (cleanupError) {
      console.error('Failed to cleanup login attempts:', cleanupError);
    }
    
    // 1. Check Rate Limiter (Brute Force Protection)
    const recentFailedAttempts = await db.loginAttempt.count({
      where: {
        ip: ip,
        success: false,
        timestamp: { gte: lockoutTimeWindow }
      }
    });

    if (recentFailedAttempts >= 3) {
      // Calculate exact wait time based on the oldest failed attempt in the window
      const firstFailed = await db.loginAttempt.findFirst({
        where: { ip, success: false, timestamp: { gte: lockoutTimeWindow } },
        orderBy: { timestamp: 'asc' }
      });
      
      let waitMins = 15;
      if (firstFailed) {
        const expiresAt = new Date(firstFailed.timestamp.getTime() + 15 * 60 * 1000);
        waitMins = Math.max(1, Math.ceil((expiresAt.getTime() - Date.now()) / 60000));
      }
      
      return NextResponse.json(
        { success: false, message: `Too many failed login attempts. Please try again in ${waitMins} minute${waitMins !== 1 ? 's' : ''}.` },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || null;
    const expectedPassword = process.env.ADMIN_PASSWORD || null;

    if (!expectedUsername || !expectedPassword) {
      return NextResponse.json(
        { success: false, message: 'Admin credentials not configured on server' },
        { status: 500 }
      );
    }

    if (username === expectedUsername && password === expectedPassword) {
      // Log successful attempt
      await db.loginAttempt.create({ data: { ip, success: true } });

      const token = await signJWT({ username, role: 'admin' }, 60 * 60 * 24);
      
      const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
      
      // Set the token as a secure HttpOnly cookie
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      // Set the CSRF token cookie
      const csrfToken = generateCsrfToken();
      response.cookies.set('csrf_token', csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    // Log failed attempt
    await db.loginAttempt.create({ data: { ip, success: false } });
    
    const attemptsLeft = 3 - (recentFailedAttempts + 1);
    
    let errorMessage = 'Invalid username or password.';
    if (attemptsLeft > 0) {
      errorMessage += ` You have ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`;
    } else {
      errorMessage = 'Invalid username or password. Account locked. Please try again in 15 minutes.';
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
