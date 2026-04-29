/**
 * Periodicidad options for events
 */
export const PERIODICIDAD = {
  NINGUNA: "ninguna",
  SEMANAL: "semanal",
  QUINCENAL: "quincenal",
  MENSUAL: "mensual",
  MENSUAL_RELATIVO: "mensual_relativo",
  ANUAL: "anual",
} as const

export type Periodicidad = (typeof PERIODICIDAD)[keyof typeof PERIODICIDAD]

export const PERIODICIDAD_OPTIONS = [
  { value: "ninguna", label: "Sin repetición" },
  { value: "semanal", label: "Semanal" },
  { value: "quincenal", label: "Quincenal" },
  { value: "mensual", label: "Mensual (mismo dia del mes)" },
  { value: "mensual_relativo", label: "Mensual (dia especifico)" },
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

/** Para selects de día relativo — índice JS: 0=Domingo, 1=Lunes … 6=Sabado */
export const DIAS_SEMANA_OPTIONS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miercoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sabado" },
] as const

/** Para selects de ocurrencia mensual. -1 = último del mes */
export const SEMANA_DEL_MES_OPTIONS = [
  { value: 1, label: "1er" },
  { value: 2, label: "2do" },
  { value: 3, label: "3er" },
  { value: 4, label: "4to" },
  { value: -1, label: "Ultimo" },
] as const

/**
 * Span types for gallery images
 */
export const SPAN_TYPES = {
  NORMAL: "normal",
  WIDE: "wide",
  TALL: "tall",
} as const

export type SpanType = (typeof SPAN_TYPES)[keyof typeof SPAN_TYPES]
