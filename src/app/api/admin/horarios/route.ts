import { NextRequest } from "next/server"
import { revalidateTag } from "next/cache"
import { horarioService, createHorarioSchema } from "@/modules/horarios"
import { withAuth } from "@/modules/auth"
import { success, created, handleError } from "@/shared/api"

export const GET = withAuth(async () => {
  try {
    const horarios = await horarioService.getAll()
    return success(horarios)
  } catch (error) {
    return handleError(error)
  }
})

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const data = createHorarioSchema.parse(body)
    const horario = await horarioService.create(data)
    revalidateTag("horarios", {})
    return created(horario)
  } catch (error) {
    return handleError(error)
  }
})
