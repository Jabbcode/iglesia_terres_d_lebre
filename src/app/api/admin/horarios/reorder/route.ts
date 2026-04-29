import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { horarioService } from "@/modules/horarios"
import { withAuth } from "@/modules/auth"
import { success, handleError } from "@/shared/api"
import { z } from "zod"

const reorderSchema = z.object({
  horarios: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
})

export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { horarios } = reorderSchema.parse(body)

    // Actualizar todos los órdenes en paralelo
    const updates = horarios.map((h) =>
      horarioService.update(h.id, { order: h.order })
    )

    await Promise.all(updates)
    revalidatePath("/api/public/horarios")
    return success({ success: true })
  } catch (error) {
    return handleError(error)
  }
})
