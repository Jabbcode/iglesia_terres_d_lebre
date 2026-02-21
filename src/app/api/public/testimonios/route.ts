import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/public/testimonios - List active testimonios
export async function GET() {
  try {
    const testimonios = await prisma.testimonio.findMany({
      where: { activo: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        videoUrl: true,
        thumbnail: true,
      },
    })
    return NextResponse.json(testimonios)
  } catch (error) {
    console.error("Error fetching testimonios:", error)
    return NextResponse.json(
      { error: "Error al obtener testimonios" },
      { status: 500 }
    )
  }
}
