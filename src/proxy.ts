import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { negotiateLocale } from "@/lib/negotiate-locale";

const locales = ["es", "en"];
const defaultLocale = "es";

// CRITICAL CHANGE FOR NEXT 16: The middleware function is now named "proxy"
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    // In proxy.ts, an empty return lets the original request pass through
    return;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  const locale = negotiateLocale(
    request.headers.get("accept-language"),
    locales,
    defaultLocale,
  );

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|admin).*)"],
};
