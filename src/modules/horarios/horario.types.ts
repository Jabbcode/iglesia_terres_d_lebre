import type { Horario as PrismaHorario, HorarioTranslation } from "@prisma/client"
export type { CreateHorarioInput, UpdateHorarioInput } from "./horario.schema"

export type HorarioTranslationData = HorarioTranslation

export type Horario = PrismaHorario & {
  translations: HorarioTranslation[]
}
