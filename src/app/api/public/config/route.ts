import { configService } from "@/modules/config"
import { publicSuccess, notFound, handleError } from "@/shared/api"

export async function GET() {
  try {
    const config = await configService.get()

    if (!config) {
      return notFound("Configuración no encontrada")
    }

    return publicSuccess(config)
  } catch (error) {
    return handleError(error)
  }
}
