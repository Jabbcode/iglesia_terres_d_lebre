import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [imagenes, eventos, horarios] = await Promise.all([
      prisma.imagen.count(),
      prisma.evento.count({ where: { activo: true } }),
      prisma.horario.count({ where: { activo: true } }),
    ])

    // Próximos eventos (próximos 7 días)
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

    return NextResponse.json({
      imagenes,
      eventos,
      horarios,
      proximosEventos,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Error al obtener estadisticas" },
      { status: 500 }
    )
  }
}
