import type {
  Evento as PrismaEvento,
  EventoTranslation,
  Periodicidad,
} from "@prisma/client"
export type { CreateEventoInput, UpdateEventoInput } from "./evento.schema"
export type { Periodicidad }

export type Evento = PrismaEvento & {
  translations: EventoTranslation[]
}

/**
 * Evento resuelto para el sitio público: campos ya traducidos y `fecha`
 * calculada como próxima ocurrencia (no la fecha base). Es lo que consume
 * la home (SSR) y el JSON-LD.
 */
export type EventoProximo = {
  id: string
  nombre: string
  descripcion: string | null
  fecha: Date
  horaInicio: string
  horaFin: string | null
  ubicacion: string | null
  imagen: string | null
  periodicidad: Periodicidad
}
