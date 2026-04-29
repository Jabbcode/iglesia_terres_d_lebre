import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { publicSuccess, success, handleError } from "@/shared/api"
import { isValidLocale } from "@/lib/i18n/config"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get("lang") || "es"

    // Validate locale
    if (!isValidLocale(lang)) {
      return success([])
    }

    const testimonios = await prisma.testimonio.findMany({
      where: { activo: true },
      orderBy: { order: "asc" },
      include: {
        translations: {
          where: { lang },
        },
      },
    })

    // Map to use translated fields when available
    const testimoniosConTraducciones = testimonios.map((testimonio) => {
      const translation = testimonio.translations[0]

      return {
        ...testimonio,
        nombre: translation?.nombre || testimonio.nombre,
        descripcion: translation?.descripcion || testimonio.descripcion,
        translations: undefined, // Remove translations from response
      }
    })

    return publicSuccess(testimoniosConTraducciones)
  } catch (error) {
    return handleError(error)
  }
}
