import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"
import { deleteImage } from "@/lib/supabase"
import { REVALIDATE_24H } from "@/lib/constants/cache"
import type {
  CreateImagenInput,
  UpdateImagenInput,
  BulkUpdateInput,
} from "./imagen.schema"

export const imagenService = {
  /**
   * Get all images ordered by order then createdAt
   */
  async getAll() {
    return prisma.imagen.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })
  },

  async getPublicPage({
    limit = 20,
    cursor,
  }: { limit?: number; cursor?: string } = {}) {
    const items = await prisma.imagen.findMany({
      where: { activo: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: { id: true, src: true, alt: true, span: true },
    })
    const hasMore = items.length > limit
    return {
      items: hasMore ? items.slice(0, limit) : items,
      hasMore,
      nextCursor: hasMore ? items[limit - 1].id : null,
    }
  },

  async getPublicCached(limit = 20) {
    return unstable_cache(
      async () => {
        const items = await prisma.imagen.findMany({
          where: { activo: true },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
          take: limit + 1,
          select: { id: true, src: true, alt: true, span: true },
        })
        const hasMore = items.length > limit
        return {
          items: hasMore ? items.slice(0, limit) : items,
          hasMore,
          nextCursor: hasMore ? items[limit - 1].id : null,
        }
      },
      ["galeria-public", String(limit)],
      { tags: ["galeria"], revalidate: REVALIDATE_24H }
    )()
  },

  /**
   * Get a single image by ID
   */
  async getById(id: string) {
    return prisma.imagen.findUnique({
      where: { id },
    })
  },

  /**
   * Create a new image
   */
  async create(data: CreateImagenInput) {
    return prisma.imagen.create({ data })
  },

  /**
   * Create multiple images at once
   */
  async createMany(images: { src: string }[]) {
    const data = images.map((img) => ({
      src: img.src,
      alt: "",
      span: "normal" as const,
      activo: false,
      order: 0,
    }))

    return prisma.imagen.createMany({ data })
  },

  /**
   * Update an existing image
   */
  async update(id: string, data: UpdateImagenInput) {
    return prisma.imagen.update({
      where: { id },
      data,
    })
  },

  /**
   * Bulk update images (order, span, activo)
   */
  async bulkUpdate(input: BulkUpdateInput) {
    const updates = input.items.map((item) => {
      const data: Record<string, unknown> = {}
      if (item.order !== undefined) data.order = item.order
      if (item.span !== undefined) data.span = item.span
      if (item.activo !== undefined) data.activo = item.activo

      return prisma.imagen.update({
        where: { id: item.id },
        data,
      })
    })

    return prisma.$transaction(updates)
  },

  /**
   * Delete an image (also removes from Supabase storage if applicable)
   */
  async delete(id: string) {
    const imagen = await prisma.imagen.findUnique({
      where: { id },
    })

    if (!imagen) {
      return null
    }

    // Delete from Supabase Storage if it's a Supabase URL
    if (imagen.src.includes("supabase")) {
      await deleteImage(imagen.src)
    }

    return prisma.imagen.delete({
      where: { id },
    })
  },
}
