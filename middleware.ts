import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  let role = request.cookies.get('role')?.value;
  const tableNumber = searchParams.get('tableNumber');
  const roleParam = searchParams.get('role');

  if (roleParam && tableNumber) {
    const response = NextResponse.redirect(new URL(pathname, request.url));
    
    // Set cookies
    response.cookies.set('role', roleParam);
    
    response.cookies.set('tableNumber', tableNumber);
    
    role = roleParam;
    
    return response;
  }

  if (!role) {
    if (pathname !== '/') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  const isCustomer = role === 'customer';
  const isCashier = role === 'cashier';
  const isBarista = role === 'barista';

  const customerBaseUrl = '/';
  const cashierBaseUrl = '/admin-cashier-menu';
  const baristaBaseUrl = '/order-list';

  const notAllowedCustomerRoutes = [
    '/admin-cashier-menu',
    '/admin-active-order',
    '/admin-cashflow',
    '/admin-order-history',
    '/order-list',
    '/admin-barista-dashboard'
  ];

  const notAllowedBaristaRoutes = [
    '/', 
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
    '/order',
    '/order-list',
  ];
  
  // Customer role checks
  if (isCustomer && notAllowedCustomerRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(customerBaseUrl, request.url));
  }

  // Cashier role checks
  if (isCashier && notAllowedCashierRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(cashierBaseUrl, request.url));
  }

  // Barista role checks - THIS WAS MISSING!
  if (isBarista && notAllowedBaristaRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(baristaBaseUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/cart',
    '/order',
    '/order-list',
    '/admin-cashier-menu',
    '/admin-active-order', 
    '/admin-cashflow',
    '/admin-order-history',
    '/admin-barista-dashboard'
  ],
};