import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/testimonios/[id] - Get single testimonio
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const testimonio = await prisma.testimonio.findUnique({
      where: { id },
    })

    if (!testimonio) {
      return NextResponse.json(
        { error: "Testimonio no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(testimonio)
  } catch (error) {
    console.error("Error fetching testimonio:", error)
    return NextResponse.json(
      { error: "Error al obtener testimonio" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/testimonios/[id] - Update testimonio
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nombre, descripcion, videoUrl, thumbnail, order, activo } = body

    const testimonio = await prisma.testimonio.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        videoUrl,
        thumbnail,
        order,
        activo,
      },
    })

    return NextResponse.json(testimonio)
  } catch (error) {
    console.error("Error updating testimonio:", error)
    return NextResponse.json(
      { error: "Error al actualizar testimonio" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/testimonios/[id] - Delete testimonio
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    await prisma.testimonio.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Testimonio eliminado" })
  } catch (error) {
    console.error("Error deleting testimonio:", error)
    return NextResponse.json(
      { error: "Error al eliminar testimonio" },
      { status: 500 }
    )
  }
}
