import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const configSchema = z.object({
  nombreIglesia: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  instagram: z.string().url().nullable().optional(),
  facebook: z.string().url().nullable().optional(),
  youtube: z.string().url().nullable().optional(),
  direccion: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  horarioAtencion: z.string().nullable().optional(),
  googleMapsUrl: z.string().url().nullable().optional(),
  googleMapsEmbed: z.string().nullable().optional(),
})

export async function GET() {
  try {
    let config = await prisma.configSitio.findUnique({
      where: { id: "default" },
    })

    if (!config) {
      config = await prisma.configSitio.create({
        data: { id: "default" },
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching config:", error)
    return NextResponse.json(
      { error: "Error al obtener configuracion" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = configSchema.parse(body)

    const config = await prisma.configSitio.upsert({
      where: { id: "default" },
      update: validatedData,
      create: { id: "default", ...validatedData },
    })

    return NextResponse.json(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating config:", error)
    return NextResponse.json(
      { error: "Error al actualizar configuracion" },
      { status: 500 }
    )
  }
}
