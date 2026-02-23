import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calcularProximaOcurrencia } from "@/lib/event-utils"

export async function GET() {
  try {
    // Obtener todos los eventos activos
    const eventos = await prisma.evento.findMany({
      where: {
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        fecha: true,
        horaInicio: true,
        horaFin: true,
        ubicacion: true,
        periodicidad: true,
        repetirHasta: true,
      },
    })

    // Calcular próxima ocurrencia y filtrar eventos vigentes
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
          fecha: proximaOcurrencia, // Fecha calculada
          fechaBase: evento.fecha, // Fecha original
          horaInicio: evento.horaInicio,
          horaFin: evento.horaFin,
          ubicacion: evento.ubicacion,
          periodicidad: evento.periodicidad,
        }
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())

    return NextResponse.json(eventosConProximaFecha)
  } catch (error) {
    console.error("Error fetching public events:", error)
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 }
    )
  }
}
