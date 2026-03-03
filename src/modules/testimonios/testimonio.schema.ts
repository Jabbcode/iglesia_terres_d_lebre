import { z } from "zod"

export const createTestimonioSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string().min(1, "Descripción requerida"),
  videoUrl: z.string().url("URL de video inválida"),
  thumbnail: z.string().url("URL de thumbnail inválida"),
  order: z.number().int().default(0),
  activo: z.boolean().default(true),
})

export const updateTestimonioSchema = createTestimonioSchema.partial()

export type CreateTestimonioInput = z.infer<typeof createTestimonioSchema>
export type UpdateTestimonioInput = z.infer<typeof updateTestimonioSchema>
