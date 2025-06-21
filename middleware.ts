import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('role')?.value; // ✅ get value properly

  // Allow access to root path if no role (for login/landing page)
  // Redirect to login or allow access to other pages based on your needs
  // if (!role) {
  //   // Option 1: Allow access to root path for unauthenticated users
  //   if (pathname === '/') {
  //     return NextResponse.next();
  //   }
  //   // Option 2: Redirect to login page for protected routes
  //   // return NextResponse.redirect(new URL('/login', request.url));
    
  //   // For now, redirect non-root pages to root if no role
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  const isCustomer = role === 'customer';
  const isCashier = role === 'cashier';
  const isBarista = role === 'barista';

  const customerBaseUrl = '/';
  const cashierBaseUrl = '/admin-cashier-menu';
  const baristaBaseUrl = '/admin-barista-dashboard'; // ✅ put a valid path here

  const notAllowedCustomerRoutes = [
    '/admin-cashier-menu',
    '/admin-active-order',
    '/admin-cashflow',
    '/admin-order-history',
  ];

  const notAllowedBaristaRoutes = ['/', '/cart'];

  const notAllowedCashierRoutes = [
    '/',
    '/cart',
    '/admin-barista-dashboard', // Remove /admin-cashier-menu from here since it's the cashier's base URL
  ];
  
  // // Redirect from root to role-based home
  // if (pathname === '/') {
  //   // Customer stays at root path, no redirect needed
  //   if (isCustomer) {
  //     return NextResponse.next();
  //   }

  //   if (isCashier) {
  //     return NextResponse.redirect(new URL(cashierBaseUrl, request.url));
  //   }

  //   if (isBarista) {
  //     return NextResponse.redirect(new URL(baristaBaseUrl, request.url));
  //   }
  // } else {
  //   // Block access based on role
  //   if (isCustomer && notAllowedCustomerRoutes.includes(pathname)) {
  //     return NextResponse.redirect(new URL(customerBaseUrl, request.url));
  //   }

  //   if (isCashier && notAllowedCashierRoutes.includes(pathname)) {
  //     return NextResponse.redirect(new URL(cashierBaseUrl, request.url));
  //   }

  //   if (isBarista && notAllowedBaristaRoutes.includes(pathname)) {
  //     return NextResponse.redirect(new URL(baristaBaseUrl, request.url));
  //   }
  // }

  return NextResponse.next();
}

// export const config = {
//   matcher: ['/', '/admin-cashier-menu', '/cart', '/admin-:path*'],
// };