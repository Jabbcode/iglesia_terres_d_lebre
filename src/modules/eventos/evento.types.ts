// Re-export Prisma types for use throughout the app
export type { Evento, Periodicidad } from "@prisma/client"

// Re-export Zod input types
export type { CreateEventoInput, UpdateEventoInput } from "./evento.schema"
