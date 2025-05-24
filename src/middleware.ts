import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
  const isRootPage = request.nextUrl.pathname === "/";
  
  // Permitir acceso a archivos PWA
  if (
    request.nextUrl.pathname.includes('/manifest.json') ||
    request.nextUrl.pathname.includes('/sw.js') ||
    request.nextUrl.pathname.includes('/workbox-') ||
    request.nextUrl.pathname.startsWith('/logo/')
  ) {
    return NextResponse.next();
  }

  // Si no hay token y no es una página de autenticación, redirige a login
  if (!token && (!isAuthPage || isRootPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay token y es una página de autenticación, redirige a home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|public|login|register).*)',
  ],
};
