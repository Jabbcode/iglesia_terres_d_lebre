import { testimonioService } from "@/modules/testimonios"
import { success, handleError } from "@/shared/api"

export async function GET() {
  try {
    const testimonios = await testimonioService.getPublic()
    return success(testimonios)
  } catch (error) {
    return handleError(error)
  }
}
