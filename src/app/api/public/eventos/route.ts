import { prisma } from "@/lib/prisma"
import { calcularProximaOcurrencia } from "@/lib/event-utils"
import { success, handleError } from "@/shared/api"

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        fecha: true,
        horaInicio: true,
        horaFin: true,
        ubicacion: true,
        imagen: true,
        periodicidad: true,
        repetirHasta: true,
      },
    })

    // Calculate next occurrence and filter active events
    const eventosConProximaFecha = eventos
      .map((evento) => {
        const proximaOcurrencia = calcularProximaOcurrencia({
          fecha: evento.fecha,
          periodicidad: evento.periodicidad,
          repetirHasta: evento.repetirHasta,
        })

        if (!proximaOcurrencia) return null

        return {
          id: evento.id,
          nombre: evento.nombre,
          descripcion: evento.descripcion,
          fecha: proximaOcurrencia,
          fechaBase: evento.fecha,
          horaInicio: evento.horaInicio,
          horaFin: evento.horaFin,
          ubicacion: evento.ubicacion,
          imagen: evento.imagen,
          periodicidad: evento.periodicidad,
        }
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())

    return success(eventosConProximaFecha)
  } catch (error) {
    return handleError(error)
  }
}
