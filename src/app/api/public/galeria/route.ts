import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const imagenes = await prisma.imagen.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        src: true,
        alt: true,
        span: true,
      },
    })

    return NextResponse.json(imagenes)
  } catch (error) {
    console.error("Error fetching public galeria:", error)
    return NextResponse.json(
      { error: "Error al obtener galería" },
      { status: 500 }
    )
  }
}
