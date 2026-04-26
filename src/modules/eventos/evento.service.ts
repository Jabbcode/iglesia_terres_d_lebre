import { prisma } from "@/lib/prisma"
import type { Periodicidad } from "@prisma/client"
import type { CreateEventoInput, UpdateEventoInput } from "./evento.schema"

export const eventoService = {
  /**
   * Get all events ordered by date
   */
  async getAll(filters?: { activo?: boolean }) {
    return prisma.evento.findMany({
      where: filters,
      orderBy: { fecha: "asc" },
    })
  },

  /**
   * Get a single event by ID
   */
  async getById(id: string) {
    return prisma.evento.findUnique({
      where: { id },
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
        repetirHasta: data.repetirHasta ? new Date(data.repetirHasta) : null,
        activo: data.activo,
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
    if (data.repetirHasta !== undefined) {
      updateData.repetirHasta = data.repetirHasta
        ? new Date(data.repetirHasta)
        : null
    }
    if (data.activo !== undefined) updateData.activo = data.activo

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
   * Get upcoming active events
   */
  async getUpcoming(limit = 5) {
    return prisma.evento.findMany({
      where: {
        activo: true,
        fecha: { gte: new Date() },
      },
      orderBy: { fecha: "asc" },
      take: limit,
    })
  },
}
