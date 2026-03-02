import { NextRequest, NextResponse } from "next/server"
import { getSession, type JWTPayload } from "@/lib/auth"
import { unauthorized, forbidden } from "@/shared/api"

export type RouteContext = { params: Promise<Record<string, string>> }

type RouteHandler = (
  request: NextRequest,
  context: RouteContext,
  session: JWTPayload
) => Promise<NextResponse>

type SimpleHandler = (
  request: NextRequest,
  session: JWTPayload
) => Promise<NextResponse>

/**
 * Middleware wrapper that requires authentication
 *
 * @example
 * // With route params
 * export const GET = withAuth(async (request, context, session) => {
 *   const { id } = await context.params
 *   // session.userId, session.email, session.role available
 *   return success(data)
 * })
 *
 * // Without route params
 * export const GET = withAuth(async (request, session) => {
 *   return success(data)
 * })
 */
export function withAuth(handler: RouteHandler | SimpleHandler) {
  return async (
    request: NextRequest,
    context?: RouteContext
  ): Promise<NextResponse> => {
    const session = await getSession()

    if (!session) {
      return unauthorized()
    }

    // Check if handler expects context (has 3 params) or not (has 2 params)
    if (handler.length === 3 && context) {
      return (handler as RouteHandler)(request, context, session)
    }

    return (handler as SimpleHandler)(request, session)
  }
}

/**
 * Middleware wrapper that requires admin role
 *
 * @example
 * export const DELETE = withAdmin(async (request, context, session) => {
 *   // Only admins can reach here
 *   return success({ deleted: true })
 * })
 */
export function withAdmin(handler: RouteHandler | SimpleHandler) {
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

    if (handler.length === 3 && context) {
      return (handler as RouteHandler)(request, context, session)
    }

    return (handler as SimpleHandler)(request, session)
  }
}
