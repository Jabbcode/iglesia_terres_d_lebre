/**
 * Date formatting utilities for Spanish locale
 */

/**
 * Format a date to a full Spanish date string
 * Example: "domingo, 15 de marzo de 2024"
 */
export function formatFullDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/**
 * Format a date to a short Spanish date string
 * Example: "15 mar 2024"
 */
export function formatShortDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/**
 * Format a date to only day and month
 * Example: "15 de marzo"
 */
export function formatDayMonth(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  })
}

/**
 * Format time in 24h format
 * Example: "14:30"
 */
export function formatTime(time: string): string {
  return time
}

/**
 * Format a time range
 * Example: "14:30 - 16:00" or "14:30" if no end time
 */
export function formatTimeRange(start: string, end?: string | null): string {
  if (!end) return start
  return `${start} - ${end}`
}
