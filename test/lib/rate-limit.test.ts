import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { isRateLimited, recordFailure } from "@/lib/rate-limit"

// El store del módulo es un Map global que persiste entre tests.
// Cada test usa una clave única para evitar contaminación.
let keyCounter = 0
function uniqueKey(): string {
  return `test-key-${++keyCounter}`
}

const OPTS = { limit: 3, windowMs: 60_000 }

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("isRateLimited", () => {
  it("devuelve no bloqueado si no hay entradas previas para la clave", () => {
    const key = uniqueKey()

    const resultado = isRateLimited(key, OPTS)

    expect(resultado).toEqual({ blocked: false, retryAfterMs: 0 })
  })

  it("devuelve no bloqueado si los fallos no han alcanzado el límite", () => {
    const key = uniqueKey()
    recordFailure(key, OPTS) // 1 fallo
    recordFailure(key, OPTS) // 2 fallos (limit = 3)

    const resultado = isRateLimited(key, OPTS)

    expect(resultado.blocked).toBe(false)
  })

  it("devuelve bloqueado cuando los fallos alcanzan el límite", () => {
    const key = uniqueKey()
    recordFailure(key, OPTS) // 1
    recordFailure(key, OPTS) // 2
    recordFailure(key, OPTS) // 3 = limit

    const resultado = isRateLimited(key, OPTS)

    expect(resultado.blocked).toBe(true)
  })

  it("devuelve retryAfterMs aproximado al tiempo restante de ventana", () => {
    const key = uniqueKey()
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)

    vi.advanceTimersByTime(20_000) // avanzo 20s dentro de la ventana de 60s

    const { blocked, retryAfterMs } = isRateLimited(key, OPTS)

    expect(blocked).toBe(true)
    // Quedan ~40s (60_000 - 20_000 = 40_000ms)
    expect(retryAfterMs).toBeGreaterThan(39_000)
    expect(retryAfterMs).toBeLessThanOrEqual(40_000)
  })

  it("devuelve no bloqueado una vez que la ventana de tiempo expira", () => {
    const key = uniqueKey()
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)

    vi.advanceTimersByTime(60_001) // ventana expirada

    const resultado = isRateLimited(key, OPTS)

    expect(resultado).toEqual({ blocked: false, retryAfterMs: 0 })
  })
})

describe("recordFailure", () => {
  it("crea una nueva entrada en el primer fallo", () => {
    const key = uniqueKey()

    recordFailure(key, OPTS)

    // El primer fallo no bloquea (necesita 3)
    expect(isRateLimited(key, OPTS).blocked).toBe(false)
  })

  it("acumula fallos hasta el límite configurado", () => {
    const key = uniqueKey()

    recordFailure(key, OPTS) // 1
    recordFailure(key, OPTS) // 2
    expect(isRateLimited(key, OPTS).blocked).toBe(false) // aún no bloqueado

    recordFailure(key, OPTS) // 3 = limit
    expect(isRateLimited(key, OPTS).blocked).toBe(true)
  })

  it("no incrementa el contador más allá del límite", () => {
    const key = uniqueKey()

    recordFailure(key, OPTS) // 1
    recordFailure(key, OPTS) // 2
    recordFailure(key, OPTS) // 3 = limit
    recordFailure(key, OPTS) // intento extra — no debe cambiar nada

    // Sigue bloqueado (no desborda)
    expect(isRateLimited(key, OPTS).blocked).toBe(true)
  })

  it("reinicia el contador al primer fallo tras expirar la ventana", () => {
    const key = uniqueKey()
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)

    vi.advanceTimersByTime(60_001) // ventana expirada

    recordFailure(key, OPTS) // primer fallo de nueva ventana

    // Un solo fallo no bloquea
    expect(isRateLimited(key, OPTS).blocked).toBe(false)
  })
})

describe("comportamiento integrado: login con fallos y éxito", () => {
  it("no bloquea si hay menos fallos que el límite", () => {
    const key = uniqueKey()

    // 2 fallos (limit = 3)
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)

    expect(isRateLimited(key, OPTS).blocked).toBe(false)
  })

  it("un login exitoso tras fallos no queda bloqueado (no llama a recordFailure)", () => {
    const key = uniqueKey()

    // 2 fallos
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)

    // Login exitoso: NO se llama a recordFailure
    // El contador sigue en 2, no bloquea
    expect(isRateLimited(key, OPTS).blocked).toBe(false)
  })

  it("bloquea tras alcanzar el límite de fallos consecutivos", () => {
    const key = uniqueKey()

    recordFailure(key, OPTS)
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)

    expect(isRateLimited(key, OPTS).blocked).toBe(true)
  })

  it("desbloquea automáticamente al expirar la ventana", () => {
    const key = uniqueKey()
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)
    recordFailure(key, OPTS)
    expect(isRateLimited(key, OPTS).blocked).toBe(true)

    vi.advanceTimersByTime(60_001)

    expect(isRateLimited(key, OPTS).blocked).toBe(false)
  })
})
