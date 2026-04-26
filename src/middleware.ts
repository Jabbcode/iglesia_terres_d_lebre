import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { locales, defaultLocale, isValidLocale } from "@/lib/i18n/config"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
)

async function verifyAuth(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language")
  if (!acceptLanguage) return defaultLocale

  // Parse accept-language header: "es-ES,es;q=0.9,en;q=0.8"
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code] = lang.trim().split(";")
      return code.split("-")[0] // Get just "es" from "es-ES"
    })

  // Find first matching locale
  for (const lang of languages) {
    if (isValidLocale(lang)) return lang
  }

  return defaultLocale
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth-token")?.value

  // Skip i18n for admin, api, login, assets, and Next.js internals
  const shouldSkipI18n =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")

  if (shouldSkipI18n) {
    // Protect /admin/* pages
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      const payload = await verifyAuth(token)
      if (!payload) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("auth-token")
        return response
      }
    }

    // Protect /api/admin/* routes
    if (pathname.startsWith("/api/admin")) {
      if (!token) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
      }

      const payload = await verifyAuth(token)
      if (!payload) {
        return NextResponse.json({ error: "Token inválido" }, { status: 401 })
      }
    }

    // If on /login and already authenticated, redirect to /admin
    if (pathname === "/login" && token) {
      const payload = await verifyAuth(token)
      if (payload) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    }

    return NextResponse.next()
  }

  // i18n handling for public routes
  // Check if pathname already has a valid locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Detect preferred locale and redirect
  const locale = getPreferredLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)

  // Preserve query parameters
  newUrl.search = request.nextUrl.search

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)",
    "/",
  ],
}
