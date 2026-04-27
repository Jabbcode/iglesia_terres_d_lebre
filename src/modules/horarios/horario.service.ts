import { prisma } from "@/lib/prisma"
import type { CreateHorarioInput, UpdateHorarioInput } from "./horario.schema"

export const horarioService = {
  async getAll() {
    return prisma.horario.findMany({
      orderBy: { order: "asc" },
      include: { translations: true },
    })
  },

  async getPublic() {
    return prisma.horario.findMany({
      where: { activo: true },
      orderBy: { order: "asc" },
      include: { translations: true },
    })
  },

  async getById(id: string) {
    return prisma.horario.findUnique({
      where: { id },
      include: { translations: true },
    })
  },

  async create(data: CreateHorarioInput) {
    const { translations, ...horarioData } = data
    return prisma.horario.create({
      data: {
        ...horarioData,
        translations: translations
          ? {
              create: translations.map((t) => ({
                lang: t.lang,
                titulo: t.titulo,
                subtitulo: t.subtitulo ?? null,
                descripcionLarga: t.descripcionLarga ?? null,
                dia: t.dia,
              })),
            }
          : undefined,
      },
    })
  },

  async update(id: string, data: UpdateHorarioInput) {
    const { translations, ...horarioData } = data
    return prisma.horario.update({
      where: { id },
      data: {
        ...horarioData,
        translations: translations
          ? {
              deleteMany: {},
              create: translations.map((t) => ({
                lang: t.lang,
                titulo: t.titulo,
                subtitulo: t.subtitulo ?? null,
                descripcionLarga: t.descripcionLarga ?? null,
                dia: t.dia,
              })),
            }
          : undefined,
      },
    })
  },

  async delete(id: string) {
    return prisma.horario.delete({
      where: { id },
    })
  },
}
