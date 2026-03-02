import { NextRequest } from "next/server"
import { eventoService, updateEventoSchema } from "@/modules/eventos"
import { withAuth, type RouteContext } from "@/modules/auth"
import { success, handleError } from "@/shared/api"

export const PATCH = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      const body = await request.json()
      const data = updateEventoSchema.parse(body)
      const evento = await eventoService.update(id, data)
      return success(evento)
    } catch (error) {
      return handleError(error)
    }
  }
)

export const DELETE = withAuth(
  async (_request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      await eventoService.delete(id)
      return success({ deleted: true })
    } catch (error) {
      return handleError(error)
    }
  }
)
