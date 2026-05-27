// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["es", "en"];
const defaultLocale = "es";

// CAMBIO CRUCIAL PARA NEXT 16: La función ahora se llama "proxy"
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Excluir las rutas del panel de administración (Payload), la API y Next
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return; // En proxy.ts, un return vacío deja pasar la solicitud original
  }

  // 2. Comprobar si la ruta de la URL ya tiene el idioma
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // 3. Detectar idioma del navegador
  const acceptLanguage = request.headers.get("accept-language") || "";
  const isEnglish = acceptLanguage.toLowerCase().includes("en");
  const locale = isEnglish ? "en" : defaultLocale;

  // 4. Redirigir usando NextResponse
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

// El matcher sigue funcionando igual
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|admin).*)"],
};
