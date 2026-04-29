import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import {
  imagenService,
  bulkCreateSchema,
  bulkUpdateSchema,
} from "@/modules/galeria"
import { withAuth } from "@/modules/auth"
import { created, success, handleError } from "@/shared/api"

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { images } = bulkCreateSchema.parse(body)

    const result = await imagenService.createMany(images)

    revalidatePath("/api/public/galeria")
    return created({
      message: `${result.count} imágenes creadas correctamente`,
      count: result.count,
    })
  } catch (error) {
    return handleError(error)
  }
})

export const PUT = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const data = bulkUpdateSchema.parse(body)

    const updates = await imagenService.bulkUpdate(data)

    revalidatePath("/api/public/galeria")
    return success({
      message: "Imágenes actualizadas correctamente",
      count: updates.length,
    })
  } catch (error) {
    return handleError(error)
  }
})
