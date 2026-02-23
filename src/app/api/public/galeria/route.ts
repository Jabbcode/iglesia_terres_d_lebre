import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const MAX_IMAGES = 20

export async function GET() {
  try {
    const imagenes = await prisma.imagen.findMany({
      where: {
        activo: true,
      },
      orderBy: { createdAt: "desc" },
      take: MAX_IMAGES,
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
