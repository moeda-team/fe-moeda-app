import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server'; 

export function middleware(request: any) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token');
  const decodedToken: any = accessToken ? jwtDecode(accessToken?.value) : {};

  const isCustomer = decodedToken.role === 'customer';
  const isCashier = decodedToken.role === 'cashier';
  const isBarista = decodedToken.role === 'barista';

  const customerBaseUrl = '/'
  const cashierBaseUrl = '/cashier'
  const baristaBaseUrl = '/barista' 

  if (pathname === '/') {
    if(isCustomer) {
      return NextResponse.redirect(customerBaseUrl)
    } else if (isCashier) {
      return NextResponse.redirect(cashierBaseUrl)
    } else if (isBarista) {
      return NextResponse.redirect(baristaBaseUrl)
    }
  }

  return NextResponse.next();
}


