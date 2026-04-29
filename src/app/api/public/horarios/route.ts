import { NextRequest } from "next/server"
import { horarioService } from "@/modules/horarios"
import { success, handleError } from "@/shared/api"
import { isValidLocale } from "@/lib/i18n/config"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get("lang") || "es"

    if (!isValidLocale(lang)) {
      return success([])
    }

    const horarios = await horarioService.getPublicCached(lang)

    const horariosConTraducciones = horarios.map((horario) => {
      const translation = horario.translations[0]

      return {
        ...horario,
        titulo: translation?.titulo || horario.titulo,
        subtitulo: translation?.subtitulo || horario.subtitulo,
        descripcionLarga:
          translation?.descripcionLarga || horario.descripcionLarga,
        dia: translation?.dia || horario.dia,
        translations: undefined,
      }
    })

    return success(horariosConTraducciones)
  } catch (error) {
    return handleError(error)
  }
}
