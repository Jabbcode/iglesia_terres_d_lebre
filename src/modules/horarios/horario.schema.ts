import { z } from "zod"

export const createHorarioSchema = z.object({
  titulo: z.string().min(1, "Título requerido"),
  subtitulo: z.string().nullable().optional(),
  descripcion: z.string().nullable().optional(),
  descripcionLarga: z.string().nullable().optional(),
  dia: z.string().min(1, "Día requerido"),
  hora: z.string().min(1, "Hora requerida"),
  icono: z.string().default("Church"),
  imagen: z.string().nullable().optional(),
  mostrarDetalle: z.boolean().default(false),
  order: z.number().int().default(0),
  activo: z.boolean().default(true),
})

export const updateHorarioSchema = createHorarioSchema.partial()

export type CreateHorarioInput = z.infer<typeof createHorarioSchema>
export type UpdateHorarioInput = z.infer<typeof updateHorarioSchema>
