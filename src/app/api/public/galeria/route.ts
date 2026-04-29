import { imagenService } from "@/modules/galeria"
import { publicSuccess, handleError } from "@/shared/api"

const MAX_IMAGES = 20

export async function GET() {
  try {
    const imagenes = await imagenService.getPublicCached(MAX_IMAGES)
    return publicSuccess(imagenes)
  } catch (error) {
    return handleError(error)
  }
}
