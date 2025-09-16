import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  let role = request.cookies.get('role')?.value;
  const tableNumber = searchParams.get('tableNumber');
  const roleParam = searchParams.get('role');
  const orderId = searchParams.get('orderId');
  const orderIdsCookie = request.cookies.get('orderIds')?.value;
  const accessToken = request.cookies.get('accessToken')?.value;

  // Handle URL parameters for role and table number
  if (roleParam && tableNumber) {
    const response = NextResponse.redirect(new URL(pathname, request.url));

    response.cookies.set('role', roleParam);
    response.cookies.set('tableNumber', tableNumber);

    role = roleParam;

    return response;
  }

  let response: NextResponse | null = null;

  // ✅ Handle orderId parameter - append to orderIds cookie
  if (orderId) {
    response = NextResponse.next();

    let orderIds: string[] = [];
    if (orderIdsCookie) {
      try {
        orderIds = JSON.parse(orderIdsCookie);
      } catch (err) {
        console.error('Invalid orderIds cookie, resetting...', err);
        orderIds = [];
      }
    }

    // Tambahkan hanya jika belum ada
    if (!orderIds.includes(orderId)) {
      orderIds.push(orderId);
    }

    response.cookies.set('orderIds', JSON.stringify(orderIds));
    response.cookies.set('orderId', orderId); // terakhir digunakan
  }

  // ... ⬇️ logic role yang sudah ada tetap sama
  if (accessToken && pathname === '/login') {
    if (role === 'cashier') {
      return NextResponse.redirect(new URL('/admin-cashier-menu', request.url));
    } else if (role === 'barista') {
      return NextResponse.redirect(new URL('/order-list', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (!role) {
    if (pathname === '/' || pathname === '/login') {
      return response || NextResponse.next();
    }
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

  if (isCustomer) {
    if (notAllowedCustomerRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL(customerBaseUrl, request.url));
    }
    return response || NextResponse.next();
  }

  if (isCashier) {
    if (!accessToken && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (accessToken && notAllowedCashierRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL(cashierBaseUrl, request.url));
    }
    return response || NextResponse.next();
  }

  if (isBarista) {
    if (!accessToken && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
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
