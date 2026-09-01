import { NextRequest } from "next/server"
import { eventoService } from "@/modules/eventos"
import { calcularProximaOcurrencia } from "@/lib/event-utils"
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

    const eventos = await eventoService.getPublicCached(lang)

    // Calculate next occurrence and filter active events
    const eventosConProximaFecha = eventos
      .map((evento) => {
        const proximaOcurrencia = calcularProximaOcurrencia({
          fecha: evento.fecha,
          periodicidad: evento.periodicidad,
          repetirHasta: evento.repetirHasta,
        })

        if (!proximaOcurrencia) return null

        // Use translated fields if available, fallback to original
        const translation = evento.translations[0]

        return {
          id: evento.id,
          nombre: translation?.nombre || evento.nombre,
          descripcion: translation?.descripcion || evento.descripcion,
          fecha: proximaOcurrencia,
          fechaBase: evento.fecha,
          horaInicio: evento.horaInicio,
          horaFin: evento.horaFin,
          ubicacion: translation?.ubicacion || evento.ubicacion,
          imagen: evento.imagen,
          periodicidad: evento.periodicidad,
        }
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .sort((a, b) => {
        const fechaDiff = a.fecha.getTime() - b.fecha.getTime()
        if (fechaDiff !== 0) return fechaDiff
        return a.horaInicio.localeCompare(b.horaInicio)
      })

    return publicSuccess(eventosConProximaFecha)
  } catch (error) {
    return handleError(error)
  }
}
