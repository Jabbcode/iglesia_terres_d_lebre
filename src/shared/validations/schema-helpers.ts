import { z } from "zod"

/**
 * Transform empty strings to null for nullable fields
 */
export const emptyToNull = (val: string | null | undefined) =>
  val === "" ? null : val

/**
 * Schema for optional nullable URL fields
 * Transforms empty strings to null, validates URL format
 */
export const optionalUrl = z
  .string()
  .transform(emptyToNull)
  .pipe(z.string().url().nullable())
  .optional()

/**
 * Schema for optional nullable email fields
 * Transforms empty strings to null, validates email format
 */
export const optionalEmail = z
  .string()
  .transform(emptyToNull)
  .pipe(z.string().email().nullable())
  .optional()

/**
 * Schema for optional nullable string fields
 * Transforms empty strings to null
 */
export const optionalNullableString = z
  .string()
  .transform(emptyToNull)
  .nullable()
  .optional()

/**
 * Schema for required URL fields
 */
export const requiredUrl = z.string().url("URL inválida")

/**
 * Schema for required non-empty string fields
 */
export const requiredString = (fieldName = "Campo") =>
  z.string().min(1, `${fieldName} requerido`)
