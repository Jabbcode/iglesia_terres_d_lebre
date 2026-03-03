import { configService } from "@/modules/config"
import { success, notFound, handleError } from "@/shared/api"

export async function GET() {
  try {
    const config = await configService.get()

    if (!config) {
      return notFound("Configuración no encontrada")
    }

    return success(config)
  } catch (error) {
    return handleError(error)
  }
}
