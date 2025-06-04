import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/api/auth");
  const isRootPage = request.nextUrl.pathname === "/";

  // Permitir acceso a archivos PWA
  if (
    request.nextUrl.pathname === "/manifest.json" ||
    request.nextUrl.pathname === "/sw.js" ||
    request.nextUrl.pathname.startsWith("/workbox-") ||
    request.nextUrl.pathname.startsWith("/icons/") ||
    request.nextUrl.pathname.startsWith("/screenshots/") ||
    request.nextUrl.pathname.startsWith("/logo/") ||
    request.nextUrl.pathname.endsWith(".png") ||
    request.nextUrl.pathname.endsWith(".webmanifest")
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
    "/((?!_next/static|_next/image|favicon.ico|icons/|screenshots/|manifest.json|sw.js|workbox-|logo/).*)",
  ],
};
