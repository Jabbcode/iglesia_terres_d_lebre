import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { horarioService, updateHorarioSchema } from "@/modules/horarios"
import { withAuth, type RouteContext } from "@/modules/auth"
import { success, handleError } from "@/shared/api"

export const PATCH = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      const body = await request.json()
      const data = updateHorarioSchema.parse(body)
      const horario = await horarioService.update(id, data)
      revalidatePath("/api/public/horarios")
      return success(horario)
    } catch (error) {
      return handleError(error)
    }
  }
)

export const DELETE = withAuth(
  async (_request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      await horarioService.delete(id)
      revalidatePath("/api/public/horarios")
      return success({ deleted: true })
    } catch (error) {
      return handleError(error)
    }
  }
)
