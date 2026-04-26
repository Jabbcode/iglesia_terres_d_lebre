import { prisma } from "@/lib/prisma"
import type {
  CreateTestimonioInput,
  UpdateTestimonioInput,
} from "./testimonio.schema"

export const testimonioService = {
  async getAll() {
    return prisma.testimonio.findMany({
      orderBy: { order: "asc" },
    })
  },

  async getPublic() {
    return prisma.testimonio.findMany({
      where: { activo: true },
      orderBy: { order: "asc" },
    })
  },

  async getById(id: string) {
    return prisma.testimonio.findUnique({
      where: { id },
    })
  },

  async create(data: CreateTestimonioInput) {
    const { translations, ...testimonioData } = data
    return prisma.testimonio.create({
      data: {
        ...testimonioData,
        translations: translations
          ? {
              create: translations.map((t) => ({
                lang: t.lang,
                nombre: t.nombre,
                descripcion: t.descripcion,
              })),
            }
          : undefined,
      },
    })
  },

  async update(id: string, data: UpdateTestimonioInput) {
    return prisma.testimonio.update({
      where: { id },
      data,
    })
  },

  async delete(id: string) {
    return prisma.testimonio.delete({
      where: { id },
    })
  },
}
