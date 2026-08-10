import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/user-dashboard', '/admin-dashboard'];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // For admin routes, we need to verify the role (this would require decoding JWT)
  // For now, we'll let the client-side AuthGuard handle role-based access

  return NextResponse.next();
}

export const config = {
  matcher: ['/user-dashboard/:path*', '/admin-dashboard/:path*'],
};
