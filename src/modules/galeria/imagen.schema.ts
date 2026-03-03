import { z } from "zod"

export const spanEnum = z.enum(["normal", "tall", "wide"])

export const createImagenSchema = z.object({
  src: z.string().url("URL de imagen inválida"),
  alt: z.string().min(1, "Texto alternativo requerido"),
  span: spanEnum.default("normal"),
  order: z.number().int().default(0),
  activo: z.boolean().default(true),
})

export const updateImagenSchema = z.object({
  src: z.string().url("URL de imagen inválida").optional(),
  alt: z.string().optional(),
  span: spanEnum.optional(),
  order: z.number().int().optional(),
  activo: z.boolean().optional(),
})

export const bulkCreateSchema = z.object({
  images: z
    .array(z.object({ src: z.string().url() }))
    .min(1, "Se requiere al menos una imagen")
    .max(10, "Máximo 10 imágenes por carga"),
})

export const bulkUpdateSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().optional(),
      span: spanEnum.optional(),
      activo: z.boolean().optional(),
    })
  ),
})

export type CreateImagenInput = z.infer<typeof createImagenSchema>
export type UpdateImagenInput = z.infer<typeof updateImagenSchema>
export type BulkCreateInput = z.infer<typeof bulkCreateSchema>
export type BulkUpdateInput = z.infer<typeof bulkUpdateSchema>
