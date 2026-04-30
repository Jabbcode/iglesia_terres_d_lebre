import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { formatDayTime, getDayName, getNextDayDate } from "@/lib/format"

// Lunes 27 abr 2026 a las 10:00 — punto de referencia fijo para todos los tests de getNextDayDate
const LUNES_10H = new Date(2026, 3, 27, 10, 0, 0) // getDay() = 1

describe("formatDayTime", () => {
  it.each([
    ["LUNES" as const, "10:00", "Lunes, 10:00h"],
    ["MARTES" as const, "09:30", "Martes, 09:30h"],
    ["MIERCOLES" as const, "18:00", "Miércoles, 18:00h"],
    ["JUEVES" as const, "07:00", "Jueves, 07:00h"],
    ["VIERNES" as const, "20:00", "Viernes, 20:00h"],
    ["SABADO" as const, "11:00", "Sábados, 11:00h"],
    ["DOMINGO" as const, "12:00", "Domingos, 12:00h"],
  ])("'%s' a las '%s' → '%s'", (dia, hora, esperado) => {
    expect(formatDayTime(dia, hora)).toBe(esperado)
  })
})

describe("getDayName", () => {
  it.each([
    ["LUNES" as const, "Lunes"],
    ["MARTES" as const, "Martes"],
    ["MIERCOLES" as const, "Miércoles"],
    ["JUEVES" as const, "Jueves"],
    ["VIERNES" as const, "Viernes"],
    ["SABADO" as const, "Sábados"],
    ["DOMINGO" as const, "Domingos"],
  ])("'%s' → '%s'", (dia, esperado) => {
    expect(getDayName(dia)).toBe(esperado)
  })
})

describe("getNextDayDate", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(LUNES_10H)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("devuelve hoy si el día coincide y la hora aún no ha pasado", () => {
    // Hoy es lunes 10:00 — objetivo: lunes 18:00 (futuro)
    const resultado = getNextDayDate("LUNES", "18:00")

    expect(resultado).toEqual(new Date(2026, 3, 27, 18, 0, 0))
  })

  it("devuelve la semana siguiente si el día coincide pero la hora ya pasó", () => {
    // Hoy es lunes 10:00 — objetivo: lunes 09:00 (pasado)
    const resultado = getNextDayDate("LUNES", "09:00")

    expect(resultado).toEqual(new Date(2026, 3, 27 + 7, 9, 0, 0)) // lunes 4 may
  })

  it("devuelve el día correcto de la misma semana si es futuro", () => {
    // Hoy es lunes — objetivo: miércoles (2 días después)
    const resultado = getNextDayDate("MIERCOLES", "18:00")

    expect(resultado).toEqual(new Date(2026, 3, 29, 18, 0, 0)) // miércoles 29 abr
  })

  it("devuelve el día correcto de la semana siguiente si ya pasó en esta semana", () => {
    // Hoy es lunes — objetivo: domingo (el anterior fue hace 1 día)
    const resultado = getNextDayDate("DOMINGO", "11:00")

    expect(resultado).toEqual(new Date(2026, 4, 3, 11, 0, 0)) // domingo 3 may
  })

  it("establece los minutos y segundos correctamente en la fecha resultante", () => {
    const resultado = getNextDayDate("MIERCOLES", "09:30")

    expect(resultado.getHours()).toBe(9)
    expect(resultado.getMinutes()).toBe(30)
    expect(resultado.getSeconds()).toBe(0)
    expect(resultado.getMilliseconds()).toBe(0)
  })
})
