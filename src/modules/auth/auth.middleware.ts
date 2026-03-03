import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { unauthorized, forbidden } from "@/shared/api"

export type RouteContext = { params: Promise<Record<string, string>> }

type RouteHandlerWithContext = (
  request: NextRequest,
  context: RouteContext
) => Promise<NextResponse>

type RouteHandlerSimple = (request: NextRequest) => Promise<NextResponse>

type RouteHandler = RouteHandlerWithContext | RouteHandlerSimple

/**
 * Middleware wrapper that requires authentication
 *
 * @example
 * // With route params (e.g., /api/admin/eventos/[id])
 * export const PATCH = withAuth(async (request, context) => {
 *   const { id } = await context.params
 *   return success(data)
 * })
 *
 * // Without route params (e.g., /api/admin/eventos)
 * export const GET = withAuth(async () => {
 *   return success(data)
 * })
 */
export function withAuth(handler: RouteHandler) {
  return async (
    request: NextRequest,
    context?: RouteContext
  ): Promise<NextResponse> => {
    const session = await getSession()

    if (!session) {
      return unauthorized()
    }

    // If context is provided (route has params like [id]), pass it
    if (context) {
      return (handler as RouteHandlerWithContext)(request, context)
    }

    return (handler as RouteHandlerSimple)(request)
  }
}

/**
 * Middleware wrapper that requires admin role
 *
 * @example
 * export const DELETE = withAdmin(async (request, context) => {
 *   const { id } = await context.params
 *   return success({ deleted: true })
 * })
 */
export function withAdmin(handler: RouteHandler) {
  return async (
    request: NextRequest,
    context?: RouteContext
  ): Promise<NextResponse> => {
    const session = await getSession()

    if (!session) {
      return unauthorized()
    }

    if (session.role !== "ADMIN") {
      return forbidden("Se requiere rol de administrador")
    }

    if (context) {
      return (handler as RouteHandlerWithContext)(request, context)
    }

    return (handler as RouteHandlerSimple)(request)
  }
}
