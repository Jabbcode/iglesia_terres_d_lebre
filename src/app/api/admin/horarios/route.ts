import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const horarioSchema = z.object({
  titulo: z.string().min(1, "Titulo requerido"),
  descripcion: z.string().nullable().optional(),
  dia: z.string().min(1, "Dia requerido"),
  hora: z.string().min(1, "Hora requerida"),
  icono: z.string().default("Church"),
  order: z.number().int().default(0),
  activo: z.boolean().default(true),
})

export async function GET() {
  try {
    const horarios = await prisma.horario.findMany({
      orderBy: { order: "asc" },
    })

    return NextResponse.json(horarios)
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return NextResponse.json(
      { error: "Error al obtener horarios" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = horarioSchema.parse(body)

    const horario = await prisma.horario.create({
      data: validatedData,
    })

    return NextResponse.json(horario, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating schedule:", error)
    return NextResponse.json(
      { error: "Error al crear horario" },
      { status: 500 }
    )
  }
}
