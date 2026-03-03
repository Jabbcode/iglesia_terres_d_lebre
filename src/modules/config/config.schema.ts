import { z } from "zod"

// Transform empty strings to null for nullable fields
const emptyToNull = (val: string | null | undefined) =>
  val === "" ? null : val

// For nullable URL fields
const optionalUrl = z
  .string()
  .transform(emptyToNull)
  .pipe(z.string().url().nullable())
  .optional()

// For nullable email field
const optionalEmail = z
  .string()
  .transform(emptyToNull)
  .pipe(z.string().email().nullable())
  .optional()

// For nullable string fields
const optionalNullableString = z
  .string()
  .transform(emptyToNull)
  .nullable()
  .optional()

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
