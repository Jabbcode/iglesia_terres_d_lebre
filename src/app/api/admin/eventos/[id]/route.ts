import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().nullable().optional(),
  fecha: z.string().datetime().optional(),
  horaInicio: z.string().min(1).optional(),
  horaFin: z.string().nullable().optional(),
  ubicacion: z.string().nullable().optional(),
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

    const updateData = {
      ...validatedData,
      ...(validatedData.fecha && { fecha: new Date(validatedData.fecha) }),
    }

    const evento = await prisma.evento.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(evento)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating event:", error)
    return NextResponse.json(
      { error: "Error al actualizar evento" },
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

    await prisma.evento.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { error: "Error al eliminar evento" },
      { status: 500 }
    )
  }
}
