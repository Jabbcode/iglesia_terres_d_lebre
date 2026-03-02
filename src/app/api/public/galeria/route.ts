import { imagenService } from "@/modules/galeria"
import { success, handleError } from "@/shared/api"

const MAX_IMAGES = 20

export async function GET() {
  try {
    const imagenes = await imagenService.getPublic(MAX_IMAGES)
    return success(imagenes)
  } catch (error) {
    return handleError(error)
  }
}
