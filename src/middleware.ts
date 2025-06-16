import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // Permitir acceso a archivos estáticos y API
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/auth") ||
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

  // Si no hay sesión y no es una página de autenticación, redirige a login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay sesión y es una página de autenticación, redirige según el rol
  if (token && isAuthPage) {
    const role = token.role as string;
    if (role === "ADMIN_SISTEMA") {
      return NextResponse.redirect(
        new URL("/main/admin/dashboard", request.url)
      );
    }
    if (role === "PERSONAL_COOPERATIVA") {
      return NextResponse.redirect(new URL("/main/dashboard", request.url));
    }
    if (role === "CLIENTE") {
      return NextResponse.redirect(new URL("/cliente/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Rutas que requieren autenticación
    "/main/:path*",
    "/cliente/:path*",
    "/configuracion/:path*",
    // Rutas de autenticación
    "/login",
    "/register",
    // Ruta raíz
    "/",
  ],
};