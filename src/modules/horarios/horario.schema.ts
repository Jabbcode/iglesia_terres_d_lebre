import { z } from "zod"

const horarioTranslationSchema = z.object({
  lang: z.enum(["ca", "en"]),
  titulo: z.string(),
  subtitulo: z.string().nullable().optional(),
  descripcionLarga: z.string().nullable().optional(),
  dia: z.string(),
})

export const createHorarioSchema = z.object({
  titulo: z.string().min(1, "Título requerido"),
  subtitulo: z.string().nullable().optional(),
  descripcionLarga: z.string().nullable().optional(),
  dia: z.string().min(1, "Día requerido"),
  hora: z.string().min(1, "Hora requerida"),
  icono: z.string().default("Church"),
  imagen: z.string().nullable().optional(),
  mostrarDetalle: z.boolean().default(false),
  order: z.number().int().default(0),
  activo: z.boolean().default(true),
  translations: z.array(horarioTranslationSchema).optional(),
})

export const updateHorarioSchema = createHorarioSchema.partial()

export type CreateHorarioInput = z.infer<typeof createHorarioSchema>
export type UpdateHorarioInput = z.infer<typeof updateHorarioSchema>
