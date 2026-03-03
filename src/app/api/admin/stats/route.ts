import { prisma } from "@/lib/prisma"
import { withAuth } from "@/modules/auth"
import { success, handleError } from "@/shared/api"

export const GET = withAuth(async () => {
  try {
    const [imagenes, eventos, horarios] = await Promise.all([
      prisma.imagen.count(),
      prisma.evento.count({ where: { activo: true } }),
      prisma.horario.count({ where: { activo: true } }),
    ])

    // Upcoming events (next 7 days)
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const proximosEventos = await prisma.evento.count({
      where: {
        activo: true,
        fecha: {
          gte: now,
          lte: nextWeek,
        },
      },
    })

    return success({
      imagenes,
      eventos,
      horarios,
      proximosEventos,
    })
  } catch (error) {
    return handleError(error)
  }
})
