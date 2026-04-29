import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { imagenService, updateImagenSchema } from "@/modules/galeria"
import { withAuth, type RouteContext } from "@/modules/auth"
import { success, notFound, handleError } from "@/shared/api"

export const PATCH = withAuth(
  async (request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      const body = await request.json()
      const data = updateImagenSchema.parse(body)
      const imagen = await imagenService.update(id, data)
      revalidatePath("/api/public/galeria")
      return success(imagen)
    } catch (error) {
      return handleError(error)
    }
  }
)

export const DELETE = withAuth(
  async (_request: NextRequest, context: RouteContext) => {
    try {
      const { id } = await context.params
      const deleted = await imagenService.delete(id)

      if (!deleted) {
        return notFound("Imagen no encontrada")
      }

      revalidatePath("/api/public/galeria")
      return success({ deleted: true })
    } catch (error) {
      return handleError(error)
    }
  }
)
