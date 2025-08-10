import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/api/user',
  '/api/admin'
];

// Define admin-only routes
const adminOnlyRoutes = [
  '/admin',
  '/api/admin'
];

// Define public routes that don't need authentication
const publicRoutes = [
  '/',
  '/courses',
  '/api/courses$', // Only exact /api/courses, not sub-routes
  '/api/auth',
  '/api/db-test'
];

// Define course content routes that need authentication
const courseContentRoutes = [
  '/api/courses/'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for exact public routes
  const isExactPublicRoute = pathname === '/api/courses';
  const isPublicRoute = publicRoutes.some(route => {
    if (route.endsWith('$')) {
      return pathname === route.slice(0, -1);
    }
    return pathname.startsWith(route);
  });
  
  // Allow exact public routes
  if (isExactPublicRoute || isPublicRoute) {
    return NextResponse.next();
  }
  
  // Check if route needs authentication (including course content)
  const needsAuth = protectedRoutes.some(route => pathname.startsWith(route)) ||
                   courseContentRoutes.some(route => pathname.startsWith(route));
  const needsAdmin = adminOnlyRoutes.some(route => pathname.startsWith(route));
  
  if (!needsAuth && !needsAdmin) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Redirect to home page for web routes
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('auth', 'required');
    return NextResponse.redirect(url);
  }
  
  // Verify token
  try {
    const payload = await verifyToken(token);
    
    if (!payload) {
      // Clear invalid token
      const response = pathname.startsWith('/api/')
        ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        : NextResponse.redirect(new URL('/', request.url));
      
      response.cookies.delete('auth-token');
      return response;
    }
    
    // Check admin access
    if (needsAdmin && payload.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
      
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Add user info to request headers for API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId.toString());
    response.headers.set('x-user-email', payload.email);
    response.headers.set('x-user-role', payload.role);
    
    return response;
    
  } catch (error) {
    console.error('Middleware auth error:', error);
    
    const response = pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
      : NextResponse.redirect(new URL('/', request.url));
    
    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
