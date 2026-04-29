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

    const horarios = await prisma.horario.findMany({
      where: { activo: true },
      orderBy: { order: "asc" },
      include: {
        translations: {
          where: { lang },
        },
      },
    })

    // Map to use translated fields when available
    const horariosConTraducciones = horarios.map((horario) => {
      const translation = horario.translations[0]

      return {
        ...horario,
        titulo: translation?.titulo || horario.titulo,
        subtitulo: translation?.subtitulo || horario.subtitulo,
        descripcionLarga:
          translation?.descripcionLarga || horario.descripcionLarga,
        dia: translation?.dia || horario.dia,
        translations: undefined, // Remove translations from response
      }
    })

    return publicSuccess(horariosConTraducciones)
  } catch (error) {
    return handleError(error)
  }
}
