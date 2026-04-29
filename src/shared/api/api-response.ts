import { NextResponse } from "next/server"
import { ZodError } from "zod"

/**
 * Success response helper
 */
export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Cached success response for public endpoints.
 * CDN (Vercel Edge) caches 24h, stale-while-revalidate 1h.
 */
export function publicSuccess<T>(data: T) {
  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  })
}

/**
 * Created response helper (201)
 */
export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 })
}

/**
 * No content response (204)
 */
export function noContent() {
  return new NextResponse(null, { status: 204 })
}

/**
 * Validation error response (400) - for Zod errors
 */
export function validationError(error: ZodError) {
  return NextResponse.json(
    {
      error: "Datos inválidos",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    },
    { status: 400 }
  )
}

/**
 * Bad request response (400) - for custom validation
 */
export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 })
}

/**
 * Unauthorized response (401)
 */
export function unauthorized(message = "No autorizado") {
  return NextResponse.json({ error: message }, { status: 401 })
}

/**
 * Forbidden response (403)
 */
export function forbidden(message = "Acceso denegado") {
  return NextResponse.json({ error: message }, { status: 403 })
}

/**
 * Not found response (404)
 */
export function notFound(message = "Recurso no encontrado") {
  return NextResponse.json({ error: message }, { status: 404 })
}

/**
 * Server error response (500)
 */
export function serverError(
  error: unknown,
  message = "Error interno del servidor"
) {
  console.error("[API Error]", error)
  return NextResponse.json({ error: message }, { status: 500 })
}

/**
 * Handle common API errors with appropriate responses
 */
export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return validationError(error)
  }

  // Prisma not found error
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "P2025"
  ) {
    return notFound()
  }

  return serverError(error)
}
