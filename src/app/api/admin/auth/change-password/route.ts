import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { withAuth } from "@/modules/auth"
import { success, handleError, unauthorized, badRequest } from "@/shared/api"
import { z } from "zod"
import bcrypt from "bcryptjs"

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
})

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const body = await request.json()
    const { currentPassword, newPassword } = changePasswordSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user) return unauthorized()

    const passwordMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passwordMatch) return badRequest("La contraseña actual es incorrecta")

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

    return success({ ok: true })
  } catch (error) {
    return handleError(error)
  }
})
