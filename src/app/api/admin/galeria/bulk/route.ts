import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface BulkImageInput {
  src: string
}

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
