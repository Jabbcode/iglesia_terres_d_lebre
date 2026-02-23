import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const imagenSchema = z.object({
  src: z.string().url("URL de imagen invalida"),
  alt: z.string().min(1, "Texto alternativo requerido"),
  span: z.enum(["normal", "tall", "wide"]).default("normal"),
  order: z.number().int().default(0),
  activo: z.boolean().default(true),
})

export async function GET() {
  try {
    const imagenes = await prisma.imagen.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(imagenes)
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json(
      { error: "Error al obtener imagenes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = imagenSchema.parse(body)

    const imagen = await prisma.imagen.create({
      data: validatedData,
    })

    return NextResponse.json(imagen, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating image:", error)
    return NextResponse.json(
      { error: "Error al crear imagen" },
      { status: 500 }
    )
  }
}
