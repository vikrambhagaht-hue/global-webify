import { NextResponse, NextRequest } from 'next/server';
import { verifyCsrf } from '@/lib/csrf';

export async function POST() {
  try {
    verifyCsrf();
  } catch (error) {
    return NextResponse.json({ success: false, error: 'CSRF validation failed' }, { status: 403 });
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}

