import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const horarios = await prisma.horario.findMany({
      where: {
        activo: true,
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        titulo: true,
        subtitulo: true,
        descripcion: true,
        descripcionLarga: true,
        dia: true,
        hora: true,
        icono: true,
        imagen: true,
        mostrarDetalle: true,
      },
    })

    return NextResponse.json(horarios)
  } catch (error) {
    console.error("Error fetching public horarios:", error)
    return NextResponse.json(
      { error: "Error al obtener horarios" },
      { status: 500 }
    )
  }
}
