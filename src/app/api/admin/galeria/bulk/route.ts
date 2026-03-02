import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

interface BulkImageInput {
  src: string
}

const bulkUpdateSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().optional(),
      span: z.enum(["normal", "tall", "wide"]).optional(),
      activo: z.boolean().optional(),
    })
  ),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { images } = body as { images: BulkImageInput[] }

    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Se requiere un array de imagenes" },
        { status: 400 }
      )
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: "El array de imagenes esta vacio" },
        { status: 400 }
      )
    }

    if (images.length > 10) {
      return NextResponse.json(
        { error: "Maximo 10 imagenes por carga" },
        { status: 400 }
      )
    }

    // Validate each image has src
    for (const img of images) {
      if (!img.src || typeof img.src !== "string") {
        return NextResponse.json(
          { error: "Cada imagen debe tener una URL valida" },
          { status: 400 }
        )
      }
    }

    // Create records with default values (alt="", span=normal, activo=false)
    const data = images.map((img) => ({
      src: img.src,
      alt: "",
      span: "normal" as const,
      activo: false,
      order: 0,
    }))

    const result = await prisma.imagen.createMany({
      data,
    })

    return NextResponse.json(
      {
        message: `${result.count} imagenes creadas correctamente`,
        count: result.count,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating gallery images:", error)
    return NextResponse.json(
      { error: "Error al crear las imagenes" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = bulkUpdateSchema.parse(body)

    // Use a transaction to update all items atomically
    const updates = await prisma.$transaction(
      items.map((item) => {
        const data: Record<string, unknown> = {}
        if (item.order !== undefined) data.order = item.order
        if (item.span !== undefined) data.span = item.span
        if (item.activo !== undefined) data.activo = item.activo

        return prisma.imagen.update({
          where: { id: item.id },
          data,
        })
      })
    )

    return NextResponse.json({
      message: "Imagenes actualizadas correctamente",
      count: updates.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating images in bulk:", error)
    return NextResponse.json(
      { error: "Error al actualizar imagenes" },
      { status: 500 }
    )
  }
}
