import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const roleAccessMap = {
  '/admin': ['admin'],
  '/approvals': ['admin'],
  '/dbms': ['admin', 'DBMS'],
  '/hr': ['admin', 'HR'],
  '/research': ['admin', 'Analyst'],
  '/development': ['admin', 'Development'],
  '/iso': ['admin', 'Analyst'],
  '/marketing': ['admin', 'Marketing'],
  '/sales': ['admin', 'Sales'],
  '/softwareNeeded': ['admin', 'Development'],
};

export async function middleware(req) {
  const secret = process.env.AUTH_SECRET;

  const pathname = req.nextUrl.pathname;

  // Allow access to the root page without authentication
  if (pathname === '/') {
    console.log('Middleware Debug - Allowing access to root page without authentication');
    return NextResponse.next();
  }

  // Attempt to retrieve the token
  const token = await getToken({ req, secret });

  if (!token) {
    console.log('Middleware Debug - No token found. Redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const userRole = token.role;

  // Debugging: Check the role
  console.log('Middleware Debug - User Role:', userRole);

  // Match route and check access
  for (const [route, allowedRoles] of Object.entries(roleAccessMap)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(userRole)) {
        console.log(`Middleware Debug - Role "${userRole}" not authorized for route "${route}". Redirecting to /403`);
        return NextResponse.redirect(new URL('/403', req.url));
      }
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: [
    // '/admin/:path*',
    // '/approvals/:path*',
    // '/hr/:path*',
    '/dbms/:path*',
    // '/research/:path*',
    // '/development/:path*',
    '/iso/:path*',
    // '/marketing/:path*',
    // '/sales/:path*',
    '/softwareNeeded/:path*',
  ],
};
