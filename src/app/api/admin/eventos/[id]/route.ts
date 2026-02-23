import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { Periodicidad } from "@prisma/client"

const periodicidadEnum = z.enum([
  "ninguna",
  "semanal",
  "quincenal",
  "mensual",
  "anual",
])

const updateSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().nullable().optional(),
  fecha: z.string().datetime().optional(),
  horaInicio: z.string().min(1).optional(),
  horaFin: z.string().nullable().optional(),
  ubicacion: z.string().nullable().optional(),
  periodicidad: periodicidadEnum.optional(),
  repetirHasta: z.string().datetime().nullable().optional(),
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

    // Construir objeto de actualización
    const updateData: Record<string, unknown> = {}

    if (validatedData.nombre !== undefined) {
      updateData.nombre = validatedData.nombre
    }
    if (validatedData.descripcion !== undefined) {
      updateData.descripcion = validatedData.descripcion
    }
    if (validatedData.fecha !== undefined) {
      updateData.fecha = new Date(validatedData.fecha)
    }
    if (validatedData.horaInicio !== undefined) {
      updateData.horaInicio = validatedData.horaInicio
    }
    if (validatedData.horaFin !== undefined) {
      updateData.horaFin = validatedData.horaFin
    }
    if (validatedData.ubicacion !== undefined) {
      updateData.ubicacion = validatedData.ubicacion
    }
    if (validatedData.periodicidad !== undefined) {
      updateData.periodicidad = validatedData.periodicidad as Periodicidad
    }
    if (validatedData.repetirHasta !== undefined) {
      updateData.repetirHasta = validatedData.repetirHasta
        ? new Date(validatedData.repetirHasta)
        : null
    }
    if (validatedData.activo !== undefined) {
      updateData.activo = validatedData.activo
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
