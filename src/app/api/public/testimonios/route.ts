import { NextRequest } from "next/server"
import { testimonioService } from "@/modules/testimonios"
import { publicSuccess, success, handleError } from "@/shared/api"
import { isValidLocale } from "@/lib/i18n/config"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get("lang") || "es"

    if (!isValidLocale(lang)) {
      return success([])
    }

    const testimonios = await testimonioService.getPublicCached(lang)

    const testimoniosConTraducciones = testimonios.map((testimonio) => {
      const translation = testimonio.translations[0]

      return {
        ...testimonio,
        nombre: translation?.nombre || testimonio.nombre,
        descripcion: translation?.descripcion || testimonio.descripcion,
        translations: undefined,
      }
    })

    return publicSuccess(testimoniosConTraducciones)
  } catch (error) {
    return handleError(error)
  }
}
