import { horarioService } from "@/modules/horarios"
import { success, handleError } from "@/shared/api"

export async function GET() {
  try {
    const horarios = await horarioService.getPublic()
    return success(horarios)
  } catch (error) {
    return handleError(error)
  }
}
