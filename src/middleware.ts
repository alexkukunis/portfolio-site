import { NextRequest, NextResponse } from 'next/server';

// The /admin page itself renders a LoginForm when the cookie is missing.
// This middleware only guards mutating API routes; page-level auth is in the route.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API mutating routes require the admin cookie.
  const needsAuth =
    (pathname.startsWith('/api/case-studies') && request.method !== 'GET') ||
    pathname.startsWith('/api/upload');

  if (!needsAuth) return NextResponse.next();

  const cookie = request.cookies.get('admin_auth')?.value;
  if (cookie === 'true') return NextResponse.next();

  return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

export const config = {
  matcher: ['/api/:path*'],
};
