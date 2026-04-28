import { z } from "zod"

export const updateConfigSchema = z.object({
  videoHero: z.string().min(1, "Video requerido").optional(),
})

export type UpdateConfigInput = z.infer<typeof updateConfigSchema>
