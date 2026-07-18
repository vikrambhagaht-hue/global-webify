import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    // Only allow authenticated admins to read the CSRF token
    await requireAdmin();
    
    const cookieStore = cookies();
    const token = cookieStore.get('csrf_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'CSRF token not found' }, { status: 404 });
    }
    
    return NextResponse.json({ csrfToken: token });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
