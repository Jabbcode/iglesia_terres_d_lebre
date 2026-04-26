import { NextRequest } from "next/server"
import { horarioService } from "@/modules/horarios"
import { withAuth } from "@/modules/auth"
import { success, handleError } from "@/shared/api"

export const GET = withAuth(async () => {
  try {
    const horarios = await horarioService.getAll()
    const maxOrder = Math.max(0, ...horarios.map((h) => h.order))
    return success({ maxOrder })
  } catch (error) {
    return handleError(error)
  }
})
