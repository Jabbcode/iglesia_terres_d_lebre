import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { locales, defaultLocale, isValidLocale } from "@/lib/i18n/config"

const rawSecret = process.env.JWT_SECRET
if (!rawSecret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET env var is required in production")
}
const JWT_SECRET = new TextEncoder().encode(
  rawSecret ?? "dev-only-secret-not-for-production"
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

  const languages = acceptLanguage.split(",").map((lang) => {
    const [code] = lang.trim().split(";")
    return code.split("-")[0]
  })

  for (const lang of languages) {
    if (isValidLocale(lang)) return lang
  }

  return defaultLocale
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth-token")?.value

  // Protect /admin/* and skip i18n for it
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
    return NextResponse.next()
  }

  // Skip i18n for /login; redirect to /admin if already authenticated
  if (pathname.startsWith("/login")) {
    if (token) {
      const payload = await verifyAuth(token)
      if (payload) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    }
    return NextResponse.next()
  }

  // i18n: if path already has a valid locale prefix, let it through
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Detect preferred locale and redirect
  const locale = getPreferredLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  newUrl.search = request.nextUrl.search

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    // Exclude static files, Next.js internals, dotfiles, and API routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)",
    "/",
  ],
}
