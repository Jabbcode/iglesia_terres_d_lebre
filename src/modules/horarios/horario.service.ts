import { prisma } from "@/lib/prisma"
import type { CreateHorarioInput, UpdateHorarioInput } from "./horario.schema"

export const horarioService = {
  async getAll() {
    return prisma.horario.findMany({
      orderBy: { order: "asc" },
    })
  },

  async getPublic() {
    return prisma.horario.findMany({
      where: { activo: true },
      orderBy: { order: "asc" },
    })
  },

  async getById(id: string) {
    return prisma.horario.findUnique({
      where: { id },
    })
  },

  async create(data: CreateHorarioInput) {
    return prisma.horario.create({ data })
  },

  async update(id: string, data: UpdateHorarioInput) {
    return prisma.horario.update({
      where: { id },
      data,
    })
  },

  async delete(id: string) {
    return prisma.horario.delete({
      where: { id },
    })
  },
}
