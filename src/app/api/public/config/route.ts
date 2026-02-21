import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const config = await prisma.configSitio.findUnique({
      where: { id: "default" },
      select: {
        nombreIglesia: true,
        descripcion: true,
        instagram: true,
        facebook: true,
        youtube: true,
        direccion: true,
        telefono: true,
        email: true,
        horarioAtencion: true,
        googleMapsUrl: true,
        googleMapsEmbed: true,
      },
    })

    if (!config) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching public config:", error)
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    )
  }
}
