import { z } from "zod"

const testimonioTranslationSchema = z.object({
  lang: z.enum(["ca", "en"]),
  nombre: z.string(),
  descripcion: z.string(),
})

export const createTestimonioSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string().min(1, "Descripción requerida"),
  videoUrl: z.string().url("URL de video inválida"),
  thumbnail: z.string().url("URL de thumbnail inválida"),
  order: z.number().int().default(0),
  activo: z.boolean().default(true),
  translations: z.array(testimonioTranslationSchema).optional(),
})

export const updateTestimonioSchema = createTestimonioSchema.partial()

export type CreateTestimonioInput = z.infer<typeof createTestimonioSchema>
export type UpdateTestimonioInput = z.infer<typeof updateTestimonioSchema>
