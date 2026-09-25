import { NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/costs', '/overdue', '/notifications'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/login' || pathname === '/api/health' || pathname === '/api/tokens') {
    return NextResponse.next();
  }

  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const session = request.cookies.get('railway-demo-session')?.value;

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    JSON.parse(decodeURIComponent(session));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/costs/:path*', '/overdue/:path*', '/notifications/:path*'],
};
