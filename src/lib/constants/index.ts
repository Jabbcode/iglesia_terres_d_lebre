/**
 * Periodicidad options for events
 */
export const PERIODICIDAD = {
  NINGUNA: "ninguna",
  SEMANAL: "semanal",
  QUINCENAL: "quincenal",
  MENSUAL: "mensual",
  ANUAL: "anual",
} as const

export type Periodicidad = (typeof PERIODICIDAD)[keyof typeof PERIODICIDAD]

export const PERIODICIDAD_OPTIONS = [
  { value: "ninguna", label: "Sin repetición" },
  { value: "semanal", label: "Semanal" },
  { value: "quincenal", label: "Quincenal" },
  { value: "mensual", label: "Mensual" },
  { value: "anual", label: "Anual" },
] as const

/**
 * Days of the week in Spanish
 */
export const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
] as const

export type DiaSemana = (typeof DIAS_SEMANA)[number]

/**
 * Span types for gallery images
 */
export const SPAN_TYPES = {
  NORMAL: "normal",
  WIDE: "wide",
  TALL: "tall",
} as const

export type SpanType = (typeof SPAN_TYPES)[keyof typeof SPAN_TYPES]
