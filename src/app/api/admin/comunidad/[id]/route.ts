import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSchema = z.object({
  titulo: z.string().min(1).optional(),
  descripcion: z.string().min(1).optional(),
  imagen: z.string().url().optional(),
  linkHref: z.string().url().nullable().optional(),
  linkLabel: z.string().nullable().optional(),
  order: z.number().int().optional(),
  activo: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateSchema.parse(body)

    const tarjeta = await prisma.tarjetaComunidad.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(tarjeta)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating community card:", error)
    return NextResponse.json(
      { error: "Error al actualizar tarjeta de comunidad" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.tarjetaComunidad.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting community card:", error)
    return NextResponse.json(
      { error: "Error al eliminar tarjeta de comunidad" },
      { status: 500 }
    )
  }
}
