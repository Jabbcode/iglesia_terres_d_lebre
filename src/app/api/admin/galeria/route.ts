import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { imagenService, createImagenSchema } from "@/modules/galeria"
import { withAuth } from "@/modules/auth"
import { success, created, handleError } from "@/shared/api"

export const GET = withAuth(async () => {
  try {
    const imagenes = await imagenService.getAll()
    return success(imagenes)
  } catch (error) {
    return handleError(error)
  }
})

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const data = createImagenSchema.parse(body)
    const imagen = await imagenService.create(data)
    revalidatePath("/api/public/galeria")
    return created(imagen)
  } catch (error) {
    return handleError(error)
  }
})
