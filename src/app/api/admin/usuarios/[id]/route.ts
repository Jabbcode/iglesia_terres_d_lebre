import { NextRequest } from "next/server"
import { usuarioService, updateUsuarioSchema } from "@/modules/usuarios"
import { withAuth, type RouteContext } from "@/modules/auth"
import { getSession } from "@/lib/auth"
import { success, handleError, badRequest } from "@/shared/api"

export const PATCH = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      const body = await request.json()
      const data = updateUsuarioSchema.parse(body)
      const usuario = await usuarioService.update(id, data)
      return success(usuario)
    } catch (error) {
      return handleError(error)
    }
  }
)

export const DELETE = withAuth(
  async (_request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      const session = await getSession()
      if (session?.userId === id) {
        return badRequest("No puedes eliminar tu propio usuario")
      }
      const deleted = await usuarioService.delete(id)
      return success(deleted)
    } catch (error) {
      return handleError(error)
    }
  }
)
