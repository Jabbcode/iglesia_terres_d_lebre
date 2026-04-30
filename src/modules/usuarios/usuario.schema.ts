import { z } from "zod"

export const createUsuarioSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
})

export const updateUsuarioSchema = z.object({
  name: z.string().min(1, "Nombre requerido").optional(),
  email: z.string().email("Email inválido").optional(),
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .optional(),
})

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>
