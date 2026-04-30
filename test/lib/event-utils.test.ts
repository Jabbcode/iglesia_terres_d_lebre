import { describe, it, expect } from "vitest"
import {
  calcularProximaOcurrencia,
  eventoEstaVigente,
  formatearPeriodicidad,
} from "@/lib/event-utils"

// Crea una fecha en medianoche local. Usar siempre este helper para
// que tests y código bajo prueba operen en la misma zona horaria.
function d(año: number, mes: number, dia: number): Date {
  return new Date(año, mes - 1, dia)
}

describe("calcularProximaOcurrencia", () => {
  describe("periodicidad ninguna", () => {
    it("devuelve la fecha si es futura", () => {
      const evento = { fecha: d(2026, 6, 15), periodicidad: "ninguna" as const }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 1, 1))

      expect(resultado).toEqual(evento.fecha)
    })

    it("devuelve null si la fecha ya pasó", () => {
      const evento = { fecha: d(2025, 1, 1), periodicidad: "ninguna" as const }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 1, 1))

      expect(resultado).toBeNull()
    })

    it("devuelve la fecha si coincide exactamente con fromDate (el evento es hoy)", () => {
      const hoy = d(2026, 3, 15)
      const evento = { fecha: hoy, periodicidad: "ninguna" as const }

      const resultado = calcularProximaOcurrencia(evento, hoy)

      expect(resultado).toEqual(hoy)
    })
  })

  describe("periodicidad semanal", () => {
    it("avanza de 7 en 7 días hasta alcanzar fromDate", () => {
      // lunes 5 ene → 12 ene → 19 ene (= fromDate, no es < hoy, se detiene)
      const evento = { fecha: d(2026, 1, 5), periodicidad: "semanal" as const }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 1, 19))

      expect(resultado).toEqual(d(2026, 1, 19))
    })

    it("devuelve null cuando repetirHasta ya superó fromDate", () => {
      const evento = {
        fecha: d(2025, 1, 5),
        periodicidad: "semanal" as const,
        repetirHasta: d(2025, 6, 1),
      }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 1, 1))

      expect(resultado).toBeNull()
    })

    it("devuelve fecha cuando la próxima ocurrencia está antes de repetirHasta", () => {
      const evento = {
        fecha: d(2026, 1, 5),
        periodicidad: "semanal" as const,
        repetirHasta: d(2026, 12, 31),
      }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 1, 19))

      expect(resultado).toEqual(d(2026, 1, 19))
    })
  })

  describe("periodicidad quincenal", () => {
    it("avanza de 14 en 14 días hasta superar fromDate", () => {
      // 5 ene → 19 ene (salta fromDate 12 ene)
      const evento = {
        fecha: d(2026, 1, 5),
        periodicidad: "quincenal" as const,
      }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 1, 12))

      expect(resultado).toEqual(d(2026, 1, 19))
    })
  })

  describe("periodicidad mensual", () => {
    it("devuelve el mismo día numérico en el mes siguiente", () => {
      const evento = { fecha: d(2026, 1, 15), periodicidad: "mensual" as const }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 3, 1))

      expect(resultado).toEqual(d(2026, 3, 15))
    })

    it("ajusta al último día del mes cuando el día no existe (31 ene → 28 feb)", () => {
      // setMonth(1) en fecha 31 ene desborda a 3 mar; setDate(0) retrocede a 28 feb
      const evento = { fecha: d(2026, 1, 31), periodicidad: "mensual" as const }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 2, 1))

      expect(resultado).toEqual(d(2026, 2, 28))
    })
  })

  describe("periodicidad mensual_relativo", () => {
    it("devuelve el primer domingo del mes siguiente (semanaDelMes = 1)", () => {
      // 4 ene 2026 = primer domingo de enero
      // 1 feb 2026 = domingo → primer domingo de febrero
      const evento = {
        fecha: d(2026, 1, 4),
        periodicidad: "mensual_relativo" as const,
        semanaDelMes: 1,
        diaSemanaRelativo: 0, // domingo
      }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 2, 1))

      expect(resultado).toEqual(d(2026, 2, 1))
    })

    it("devuelve el último domingo del mes siguiente (semanaDelMes = -1)", () => {
      // Feb 2026 tiene 28 días; domingos: 1, 8, 15, 22 → último = 22
      const evento = {
        fecha: d(2026, 1, 4),
        periodicidad: "mensual_relativo" as const,
        semanaDelMes: -1,
        diaSemanaRelativo: 0, // domingo
      }

      const resultado = calcularProximaOcurrencia(evento, d(2026, 2, 2))

      expect(resultado).toEqual(d(2026, 2, 22))
    })
  })

  describe("periodicidad anual", () => {
    it("devuelve la misma fecha exactamente un año después", () => {
      const evento = { fecha: d(2026, 3, 15), periodicidad: "anual" as const }

      const resultado = calcularProximaOcurrencia(evento, d(2027, 1, 1))

      expect(resultado).toEqual(d(2027, 3, 15))
    })

    it("ajusta al 28 feb en años no bisiestos cuando la base es 29 feb (bisiesto)", () => {
      // 29 feb 2024 (bisiesto) → setFullYear(2025) desborda a 1 mar → setDate(0) = 28 feb
      const evento = { fecha: d(2024, 2, 29), periodicidad: "anual" as const }

      const resultado = calcularProximaOcurrencia(evento, d(2025, 1, 1))

      expect(resultado).toEqual(d(2025, 2, 28))
    })
  })
})

describe("eventoEstaVigente", () => {
  it("devuelve true para un evento puntual en el futuro lejano", () => {
    const evento = { fecha: d(2099, 1, 1), periodicidad: "ninguna" as const }

    expect(eventoEstaVigente(evento)).toBe(true)
  })

  it("devuelve false para un evento puntual en el pasado lejano", () => {
    const evento = { fecha: d(2000, 1, 1), periodicidad: "ninguna" as const }

    expect(eventoEstaVigente(evento)).toBe(false)
  })

  it("devuelve true para un evento recurrente sin repetirHasta", () => {
    const evento = { fecha: d(2000, 1, 1), periodicidad: "semanal" as const }

    expect(eventoEstaVigente(evento)).toBe(true)
  })

  it("devuelve true cuando repetirHasta es futuro", () => {
    const evento = {
      fecha: d(2000, 1, 1),
      periodicidad: "semanal" as const,
      repetirHasta: d(2099, 12, 31),
    }

    expect(eventoEstaVigente(evento)).toBe(true)
  })

  it("devuelve false cuando repetirHasta ya pasó", () => {
    const evento = {
      fecha: d(2000, 1, 1),
      periodicidad: "semanal" as const,
      repetirHasta: d(2001, 1, 1),
    }

    expect(eventoEstaVigente(evento)).toBe(false)
  })
})

describe("formatearPeriodicidad", () => {
  it.each([
    ["ninguna" as const, "Una vez"],
    ["semanal" as const, "Semanal"],
    ["quincenal" as const, "Quincenal"],
    ["mensual" as const, "Mensual"],
    ["mensual_relativo" as const, "Mensual (dia especifico)"],
    ["anual" as const, "Anual"],
  ])("'%s' → '%s'", (periodicidad, etiquetaEsperada) => {
    expect(formatearPeriodicidad(periodicidad)).toBe(etiquetaEsperada)
  })
})
