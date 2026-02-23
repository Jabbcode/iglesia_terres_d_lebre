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

const eventoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string().nullable().optional(),
  fecha: z.string().datetime({ message: "Fecha invalida" }),
  horaInicio: z.string().min(1, "Hora de inicio requerida"),
  horaFin: z.string().nullable().optional(),
  ubicacion: z.string().nullable().optional(),
  periodicidad: periodicidadEnum.default("ninguna"),
  repetirHasta: z.string().datetime().nullable().optional(),
  activo: z.boolean().default(true),
})

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: { fecha: "asc" },
    })

    return NextResponse.json(eventos)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = eventoSchema.parse(body)

    const evento = await prisma.evento.create({
      data: {
        nombre: validatedData.nombre,
        descripcion: validatedData.descripcion ?? null,
        fecha: new Date(validatedData.fecha),
        horaInicio: validatedData.horaInicio,
        horaFin: validatedData.horaFin ?? null,
        ubicacion: validatedData.ubicacion ?? null,
        periodicidad: validatedData.periodicidad as Periodicidad,
        repetirHasta: validatedData.repetirHasta
          ? new Date(validatedData.repetirHasta)
          : null,
        activo: validatedData.activo,
      },
    })

    return NextResponse.json(evento, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Error al crear evento" },
      { status: 500 }
    )
  }
}
