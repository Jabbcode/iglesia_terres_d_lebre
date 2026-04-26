import { z } from "zod"

export const periodicidadEnum = z.enum([
  "ninguna",
  "semanal",
  "quincenal",
  "mensual",
  "anual",
])

export const createEventoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string().nullable().optional(),
  fecha: z.string().datetime({ message: "Fecha inválida" }),
  horaInicio: z.string().min(1, "Hora de inicio requerida"),
  horaFin: z.string().nullable().optional(),
  ubicacion: z.string().nullable().optional(),
  imagen: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().url("URL inválida").nullable().optional()
  ),
  periodicidad: periodicidadEnum.default("ninguna"),
  repetirHasta: z.string().datetime().nullable().optional(),
  activo: z.boolean().default(true),
})

export const updateEventoSchema = createEventoSchema.partial()

export type CreateEventoInput = z.infer<typeof createEventoSchema>
export type UpdateEventoInput = z.infer<typeof updateEventoSchema>
