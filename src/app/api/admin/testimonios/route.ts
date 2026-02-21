import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/admin/testimonios - List all testimonios
export async function GET() {
  try {
    const testimonios = await prisma.testimonio.findMany({
      orderBy: { order: "asc" },
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

// POST /api/admin/testimonios - Create new testimonio
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, descripcion, videoUrl, thumbnail, order, activo } = body

    const testimonio = await prisma.testimonio.create({
      data: {
        nombre,
        descripcion,
        videoUrl,
        thumbnail,
        order: order ?? 0,
        activo: activo ?? true,
      },
    })

    return NextResponse.json(testimonio, { status: 201 })
  } catch (error) {
    console.error("Error creating testimonio:", error)
    return NextResponse.json(
      { error: "Error al crear testimonio" },
      { status: 500 }
    )
  }
}
