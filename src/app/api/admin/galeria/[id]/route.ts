import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { deleteImage } from "@/lib/supabase"
import { z } from "zod"

const updateSchema = z.object({
  src: z.string().url("URL de imagen invalida").optional(),
  alt: z.string().min(1).optional(),
  span: z.enum(["normal", "tall", "wide"]).optional(),
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

    const imagen = await prisma.imagen.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(imagen)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating image:", error)
    return NextResponse.json(
      { error: "Error al actualizar imagen" },
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

    // Get the image first to have the URL for storage deletion
    const imagen = await prisma.imagen.findUnique({
      where: { id },
    })

    if (!imagen) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      )
    }

    // Delete from Supabase Storage (only if it's a Supabase URL)
    if (imagen.src.includes("supabase")) {
      await deleteImage(imagen.src)
    }

    // Delete from database
    await prisma.imagen.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Error al eliminar imagen" },
      { status: 500 }
    )
  }
}
