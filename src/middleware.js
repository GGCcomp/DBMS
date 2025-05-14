import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const roleAccessMap = {
  '/admin': ['Admin'],
  '/approvals': ['Admin'],
  '/dbms': ['Admin', 'DBMS'],
  '/hr': ['Admin', 'HR'],
  '/research': ['Admin', 'Analyst'],
  '/development': ['Admin', 'Development'],
  '/tech': ['Admin', 'Tech'],
  '/iso': ['Admin', 'Analyst'],
  '/marketing': ['Admin', 'Marketing'],
  '/sales': ['Admin', 'Sales'],
  '/softwareNeeded': ['Admin', 'Development'],
};

export async function middleware(req) {
  const secret = process.env.NEXTAUTH_SECRET;

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

  const userDepartment = token.department;

  

  // Debugging: Check the role
  console.log('Middleware Debug - User Department:', userDepartment);

  // Match route and check access
  for (const [route, allowedRoles] of Object.entries(roleAccessMap)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(userDepartment)) {
        console.log(`Middleware Debug - Department "${userDepartment}" not authorized for route "${route}". Redirecting to /403`);
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
    '/admin/:path*',
    '/approvals/:path*',
    '/hr/:path*',
    '/dbms/:path*',
    '/research/:path*',
    '/development/:path*',
    '/tech/:path*',
    '/iso/:path*',
    '/marketing/:path*',
    '/sales/:path*',
    '/softwareNeeded/:path*',
  ],
};
