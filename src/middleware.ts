import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/jwt';

async function getRedirects(origin: string): Promise<{ source: string; destination: string }[]> {
  try {
    const res = await fetch(`${origin}/api/redirects`, {
      headers: { 'x-middleware-internal': '1' },
      next: { tags: ['redirects'] }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch {
    // Silently ignore – redirects are a nice-to-have, not critical
  }
  return [];
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Set header to pass the current pathname and full URL to Server Components (like layouts)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-url', request.url);

  // Check custom redirects first (excluding assets, api, and admin panel pages)
  // NOTE: We do NOT fetch /redirects.json from our own URL here because that
  // triggers middleware recursively (infinite loop → 500 on Vercel/production).
  // Instead, we fetch the redirects from the DB via an API route that is
  // excluded from the middleware matcher, or skip if not available.
  if (
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/admin') &&
    !pathname.endsWith('.json')
  ) {
    const origin = request.nextUrl.origin;
    const redirects = await getRedirects(origin);

    const match = redirects.find(
      (r) =>
        r.source === pathname ||
        r.source === pathname + '/' ||
        pathname === r.source + '/'
    );
    if (match && match.destination) {
      const destUrl = match.destination.startsWith('http')
        ? match.destination
        : new URL(match.destination, request.url).toString();
      return NextResponse.redirect(destUrl, 301);
    }
  }

  // We only care about protecting /admin and /api/admin routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminApiRoute = pathname.startsWith('/api/admin');

  if (isAdminRoute || isAdminApiRoute) {
    const token = request.cookies.get('admin_session')?.value;
    const payload = token ? await verifyJWT(token) : null;

    const isLoginPage = pathname === '/admin/login';

    // 1. Not logged in -> Redirect to login (or return 401 for API)
    if (!payload && !isLoginPage) {
      if (isAdminApiRoute) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // 2. Already logged in -> Redirect away from login page
    if (payload && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // 3. Valid Login -> Rolling Session (Extend cookie by 24h)
    let response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    if (payload && token) {
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // Reset to 7 days from now
        path: '/',
      });
    }

    return response;
  }

  // Pass-through for public routes
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Exclude static assets but INCLUDE ALL APIs so we can intercept /api/admin
    '/((?!_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};
