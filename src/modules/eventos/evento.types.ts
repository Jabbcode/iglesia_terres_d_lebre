import type { Evento as PrismaEvento, EventoTranslation, Periodicidad } from "@prisma/client"
export type { CreateEventoInput, UpdateEventoInput } from "./evento.schema"
export type { Periodicidad }

export type Evento = PrismaEvento & {
  translations: EventoTranslation[]
}
