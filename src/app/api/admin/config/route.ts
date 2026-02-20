import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Transform empty strings to null for nullable fields
const emptyToNull = (val: string | null | undefined) =>
  val === "" ? null : val

// For nullable URL fields
const optionalUrl = z
  .string()
  .transform(emptyToNull)
  .pipe(z.string().url().nullable())
  .optional()

// For nullable email field
const optionalEmail = z
  .string()
  .transform(emptyToNull)
  .pipe(z.string().email().nullable())
  .optional()

// For nullable string fields
const optionalNullableString = z
  .string()
  .transform(emptyToNull)
  .nullable()
  .optional()

const configSchema = z.object({
  // Non-nullable fields (have defaults in Prisma)
  nombreIglesia: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  // Nullable fields
  instagram: optionalUrl,
  facebook: optionalUrl,
  youtube: optionalUrl,
  direccion: optionalNullableString,
  telefono: optionalNullableString,
  email: optionalEmail,
  horarioAtencion: optionalNullableString,
  googleMapsUrl: optionalUrl,
  googleMapsEmbed: optionalNullableString,
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
