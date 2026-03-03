import { NextRequest } from "next/server"
import {
  testimonioService,
  updateTestimonioSchema,
} from "@/modules/testimonios"
import { withAuth, type RouteContext } from "@/modules/auth"
import { success, notFound, handleError } from "@/shared/api"

export const GET = withAuth(
  async (_request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      const testimonio = await testimonioService.getById(id)

      if (!testimonio) {
        return notFound("Testimonio no encontrado")
      }

      return success(testimonio)
    } catch (error) {
      return handleError(error)
    }
  }
)

export const PUT = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      const body = await request.json()
      const data = updateTestimonioSchema.parse(body)
      const testimonio = await testimonioService.update(id, data)
      return success(testimonio)
    } catch (error) {
      return handleError(error)
    }
  }
)

export const DELETE = withAuth(
  async (_request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      await testimonioService.delete(id)
      return success({ deleted: true })
    } catch (error) {
      return handleError(error)
    }
  }
)
