import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const tarjetas = await prisma.tarjetaComunidad.findMany({
      where: {
        activo: true,
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        imagen: true,
        linkHref: true,
        linkLabel: true,
      },
    })

    return NextResponse.json(tarjetas)
  } catch (error) {
    console.error("Error fetching public community cards:", error)
    return NextResponse.json(
      { error: "Error al obtener tarjetas de comunidad" },
      { status: 500 }
    )
  }
}
