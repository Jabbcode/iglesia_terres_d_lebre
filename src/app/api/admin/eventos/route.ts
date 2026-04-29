import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { eventoService, createEventoSchema } from "@/modules/eventos"
import { withAuth } from "@/modules/auth"
import { success, created, handleError } from "@/shared/api"

export const GET = withAuth(async () => {
  try {
    const eventos = await eventoService.getAll()
    return success(eventos)
  } catch (error) {
    return handleError(error)
  }
})

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const data = createEventoSchema.parse(body)
    const evento = await eventoService.create(data)
    revalidatePath("/api/public/eventos")
    return created(evento)
  } catch (error) {
    return handleError(error)
  }
})
