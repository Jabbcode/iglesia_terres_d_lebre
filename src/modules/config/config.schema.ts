import { z } from "zod"
import {
  optionalUrl,
  optionalEmail,
  optionalNullableString,
} from "@/shared/validations"

export const updateConfigSchema = z.object({
  // Non-nullable fields (have defaults in Prisma)
  nombreIglesia: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  videoHero: z.string().min(1, "Video requerido").optional(),
  // Nullable fields
  instagram: optionalUrl,
  facebook: optionalUrl,
  youtube: optionalUrl,
  direccion: optionalNullableString,
  telefono: optionalNullableString,
  email: optionalEmail,
  horarioAtencion: optionalNullableString,
  googleMapsUrl: optionalUrl,
  googleMapsEmbed: optionalNullableString,
})

export type UpdateConfigInput = z.infer<typeof updateConfigSchema>
