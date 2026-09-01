import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"
import { REVALIDATE_24H } from "@/lib/constants/cache"
import { calcularProximaOcurrencia } from "@/lib/event-utils"
import type { Periodicidad } from "@prisma/client"
import type { CreateEventoInput, UpdateEventoInput } from "./evento.schema"
import type { EventoProximo } from "./evento.types"

export const eventoService = {
  /**
   * Get all events ordered by date
   */
  async getAll(filters?: { activo?: boolean }) {
    return prisma.evento.findMany({
      where: filters,
      orderBy: { fecha: "asc" },
      include: { translations: true },
    })
  },

  /**
   * Get a single event by ID
   */
  async getById(id: string) {
    return prisma.evento.findUnique({
      where: { id },
      include: { translations: true },
    })
  },

  /**
   * Create a new event
   */
  async create(data: CreateEventoInput) {
    return prisma.evento.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        fecha: new Date(data.fecha),
        horaInicio: data.horaInicio,
        horaFin: data.horaFin ?? null,
        ubicacion: data.ubicacion ?? null,
        imagen: data.imagen ?? null,
        periodicidad: data.periodicidad as Periodicidad,
        semanaDelMes: data.semanaDelMes ?? null,
        diaSemanaRelativo: data.diaSemanaRelativo ?? null,
        repetirHasta: data.repetirHasta ? new Date(data.repetirHasta) : null,
        activo: data.activo,
        translations: data.translations
          ? {
              create: data.translations.map((t) => ({
                lang: t.lang,
                nombre: t.nombre,
                descripcion: t.descripcion ?? null,
                ubicacion: t.ubicacion ?? null,
              })),
            }
          : undefined,
      },
    })
  },

  /**
   * Update an existing event
   */
  async update(id: string, data: UpdateEventoInput) {
    const updateData: Record<string, unknown> = {}

    if (data.nombre !== undefined) updateData.nombre = data.nombre
    if (data.descripcion !== undefined)
      updateData.descripcion = data.descripcion
    if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha)
    if (data.horaInicio !== undefined) updateData.horaInicio = data.horaInicio
    if (data.horaFin !== undefined) updateData.horaFin = data.horaFin
    if (data.ubicacion !== undefined) updateData.ubicacion = data.ubicacion
    if (data.imagen !== undefined) updateData.imagen = data.imagen
    if (data.periodicidad !== undefined)
      updateData.periodicidad = data.periodicidad as Periodicidad
    if (data.semanaDelMes !== undefined)
      updateData.semanaDelMes = data.semanaDelMes ?? null
    if (data.diaSemanaRelativo !== undefined)
      updateData.diaSemanaRelativo = data.diaSemanaRelativo ?? null
    if (data.repetirHasta !== undefined) {
      updateData.repetirHasta = data.repetirHasta
        ? new Date(data.repetirHasta)
        : null
    }
    if (data.activo !== undefined) updateData.activo = data.activo

    if (data.translations !== undefined) {
      updateData.translations = {
        deleteMany: {},
        create: data.translations.map((t) => ({
          lang: t.lang,
          nombre: t.nombre,
          descripcion: t.descripcion ?? null,
          ubicacion: t.ubicacion ?? null,
        })),
      }
    }

    return prisma.evento.update({
      where: { id },
      data: updateData,
    })
  },

  /**
   * Delete an event
   */
  async delete(id: string) {
    return prisma.evento.delete({
      where: { id },
    })
  },

  /**
   * Get active events with their translations for a locale (public GET).
   * Cached por tag "eventos"; el cálculo de próxima ocurrencia queda fuera
   * (depende de la fecha actual y no debe cachearse).
   */
  async getPublicCached(lang: string) {
    return unstable_cache(
      () =>
        prisma.evento.findMany({
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
            semanaDelMes: true,
            diaSemanaRelativo: true,
            repetirHasta: true,
            translations: { where: { lang } },
          },
        }),
      ["eventos-public", lang],
      { tags: ["eventos"], revalidate: REVALIDATE_24H }
    )()
  },

  /**
   * Eventos activos resueltos para el sitio público: parte de las filas
   * cacheadas (`getPublicCached`) y calcula la próxima ocurrencia por request
   * — ese cálculo depende de la fecha actual y no puede cachearse. Descarta
   * los eventos únicos ya pasados y ordena por próxima fecha + hora.
   */
  async getProximosPublic(lang: string): Promise<EventoProximo[]> {
    const eventos = await this.getPublicCached(lang)

    return eventos
      .map((evento): EventoProximo | null => {
        const proximaOcurrencia = calcularProximaOcurrencia({
          fecha: evento.fecha,
          periodicidad: evento.periodicidad,
          semanaDelMes: evento.semanaDelMes,
          diaSemanaRelativo: evento.diaSemanaRelativo,
          repetirHasta: evento.repetirHasta,
        })

        if (!proximaOcurrencia) return null

        const translation = evento.translations[0]

        return {
          id: evento.id,
          nombre: translation?.nombre || evento.nombre,
          descripcion: translation?.descripcion || evento.descripcion,
          fecha: proximaOcurrencia,
          horaInicio: evento.horaInicio,
          horaFin: evento.horaFin,
          ubicacion: translation?.ubicacion || evento.ubicacion,
          imagen: evento.imagen,
          periodicidad: evento.periodicidad,
        }
      })
      .filter((e): e is EventoProximo => e !== null)
      .sort((a, b) => {
        const fechaDiff = a.fecha.getTime() - b.fecha.getTime()
        if (fechaDiff !== 0) return fechaDiff
        return a.horaInicio.localeCompare(b.horaInicio)
      })
  },
}
