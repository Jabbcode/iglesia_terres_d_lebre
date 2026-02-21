import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const tarjetaSchema = z.object({
  titulo: z.string().min(1, "Titulo requerido"),
  descripcion: z.string().min(1, "Descripcion requerida"),
  imagen: z.string().url("URL de imagen invalida"),
  linkHref: z.string().url().nullable().optional(),
  linkLabel: z.string().nullable().optional(),
  order: z.number().int().default(0),
  activo: z.boolean().default(true),
})

export async function GET() {
  try {
    const tarjetas = await prisma.tarjetaComunidad.findMany({
      orderBy: { order: "asc" },
    })

    return NextResponse.json(tarjetas)
  } catch (error) {
    console.error("Error fetching community cards:", error)
    return NextResponse.json(
      { error: "Error al obtener tarjetas de comunidad" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = tarjetaSchema.parse(body)

    const tarjeta = await prisma.tarjetaComunidad.create({
      data: validatedData,
    })

    return NextResponse.json(tarjeta, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating community card:", error)
    return NextResponse.json(
      { error: "Error al crear tarjeta de comunidad" },
      { status: 500 }
    )
  }
}
