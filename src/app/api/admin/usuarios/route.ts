import { NextRequest } from "next/server"
import { usuarioService, createUsuarioSchema } from "@/modules/usuarios"
import { withAuth } from "@/modules/auth"
import { success, created, handleError } from "@/shared/api"

export const GET = withAuth(async () => {
  try {
    const usuarios = await usuarioService.getAll()
    return success(usuarios)
  } catch (error) {
    return handleError(error)
  }
})

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const data = createUsuarioSchema.parse(body)
    const usuario = await usuarioService.create(data)
    return created(usuario)
  } catch (error) {
    return handleError(error)
  }
})
