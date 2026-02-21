import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    const eventos = await prisma.evento.findMany({
      where: {
        activo: true,
        fecha: {
          gte: now,
        },
      },
      orderBy: { fecha: "asc" },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        fecha: true,
        horaInicio: true,
        horaFin: true,
        ubicacion: true,
      },
    })

    return NextResponse.json(eventos)
  } catch (error) {
    console.error("Error fetching public events:", error)
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 }
    )
  }
}
