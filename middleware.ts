import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  let role = request.cookies.get('role')?.value;
  const tableNumber = searchParams.get('tableNumber');
  const roleParam = searchParams.get('role');
  const orderId = searchParams.get('orderId');
  const accessToken = request.cookies.get('accessToken')?.value;

  // Handle URL parameters for role and table number
  if (roleParam && tableNumber) {
    const response = NextResponse.redirect(new URL(pathname, request.url));
    
    // Set cookies
    response.cookies.set('role', roleParam);
    response.cookies.set('tableNumber', tableNumber);
    
    role = roleParam;
    
    return response;
  }

  // Handle orderId parameter - set cookie and continue processing
  let response: NextResponse | null = null;
  
  if(orderId) {
    // We'll set the cookie on whatever response we end up returning
    response = NextResponse.next();
    response.cookies.set('orderId', orderId);
  }

  // If user has access token and tries to access login, redirect based on role
  if (accessToken && pathname === '/login') {
    if (role === 'cashier') {
      return NextResponse.redirect(new URL('/admin-cashier-menu', request.url));
    } else if (role === 'barista') {
      return NextResponse.redirect(new URL('/order-list', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If no role is set
  if (!role) {
    // Allow access to home page and login page
    if (pathname === '/' || pathname === '/login') {
      return response || NextResponse.next();
    }
    // Redirect to home page for other routes
    return NextResponse.redirect(new URL('/', request.url));
  }

  const isCustomer = role === 'customer';
  const isCashier = role === 'cashier';
  const isBarista = role === 'barista';

  const customerBaseUrl = '/';
  const cashierBaseUrl = '/admin-cashier-menu';
  const baristaBaseUrl = '/order-list';

  const notAllowedCustomerRoutes = [
    '/login',
    '/admin-cashier-menu',
    '/admin-active-order',
    '/admin-cashflow',
    '/admin-order-history',
    '/order-list',
    '/admin-barista-dashboard'
  ];

  const notAllowedBaristaRoutes = [
    '/', 
    '/login',
    '/cart', 
    '/order', 
    '/admin-cashier-menu', 
    '/admin-active-order', 
    '/admin-cashflow', 
    '/admin-order-history'
  ];

  const notAllowedCashierRoutes = [
    '/',
    '/cart',
    '/order-list',
  ];

  // Customer role checks
  if (isCustomer) {
    if (notAllowedCustomerRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL(customerBaseUrl, request.url));
    }
    return response || NextResponse.next();
  }

  // Cashier role checks
  if (isCashier) {
    // If cashier doesn't have access token, redirect to login
    if (!accessToken && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // If cashier has access token but tries to access restricted routes
    if (accessToken && notAllowedCashierRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL(cashierBaseUrl, request.url));
    }
    
    return response || NextResponse.next();
  }

  // Barista role checks
  if (isBarista) {
    // If barista doesn't have access token, redirect to login
    if (!accessToken && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // If barista has access token but tries to access restricted routes
    if (accessToken && notAllowedBaristaRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL(baristaBaseUrl, request.url));
    }
    
    return response || NextResponse.next();
  }

  return response || NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/cart',
    '/order',
    '/order-list',
    '/admin-cashier-menu',
    '/admin-active-order', 
    '/admin-cashflow',
    '/admin-order-history',
    '/admin-barista-dashboard',
    '/bills-note'
  ],
};