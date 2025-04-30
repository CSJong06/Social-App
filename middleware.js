import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// List of public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register'];

// Function to verify JWT token
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Verify token
  const payload = await verifyToken(token);

  // If token is invalid, redirect to login
  if (!payload) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If token is valid, allow request
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 