import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"
import type {
  CreateTestimonioInput,
  UpdateTestimonioInput,
} from "./testimonio.schema"

export const testimonioService = {
  async getAll() {
    return prisma.testimonio.findMany({
      orderBy: { order: "asc" },
      include: { translations: true },
    })
  },

  async getPublic() {
    return prisma.testimonio.findMany({
      where: { activo: true },
      orderBy: { order: "asc" },
      include: { translations: true },
    })
  },

  async getPublicCached(lang: string) {
    return unstable_cache(
      () =>
        prisma.testimonio.findMany({
          where: { activo: true },
          orderBy: { order: "asc" },
          include: { translations: { where: { lang } } },
        }),
      ["testimonios-public", lang],
      { tags: ["testimonios"], revalidate: 86400 }
    )()
  },

  async getById(id: string) {
    return prisma.testimonio.findUnique({
      where: { id },
      include: { translations: true },
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
    const { translations, ...testimonioData } = data
    return prisma.testimonio.update({
      where: { id },
      data: {
        ...testimonioData,
        translations: translations
          ? {
              deleteMany: {},
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

  async delete(id: string) {
    return prisma.testimonio.delete({
      where: { id },
    })
  },
}
