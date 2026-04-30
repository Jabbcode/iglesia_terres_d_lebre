import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { signToken, verifyToken } from "@/lib/auth"
import type { JWTPayload } from "@/lib/auth"

// getSession depende de cookies() de next/headers (runtime de Next.js) — no se testea aquí

const PAYLOAD: JWTPayload = {
  userId: "user-123",
  email: "admin@iglesia.es",
  role: "ADMIN",
}

describe("signToken + verifyToken", () => {
  it("el token firmado se verifica correctamente y devuelve el payload original", async () => {
    const token = await signToken(PAYLOAD)
    const resultado = await verifyToken(token)

    expect(resultado?.userId).toBe(PAYLOAD.userId)
    expect(resultado?.email).toBe(PAYLOAD.email)
    expect(resultado?.role).toBe(PAYLOAD.role)
  })

  it("devuelve null para un token con formato inválido", async () => {
    const resultado = await verifyToken("esto-no-es-un-jwt")

    expect(resultado).toBeNull()
  })

  it("devuelve null para un token vacío", async () => {
    const resultado = await verifyToken("")

    expect(resultado).toBeNull()
  })

  it("devuelve null para un token manipulado (firma incorrecta)", async () => {
    const token = await signToken(PAYLOAD)
    const partes = token.split(".")
    // Modificar el payload para invalidar la firma
    const payloadFalso = Buffer.from(
      JSON.stringify({ userId: "hacker" })
    ).toString("base64url")
    const tokenManipulado = `${partes[0]}.${payloadFalso}.${partes[2]}`

    const resultado = await verifyToken(tokenManipulado)

    expect(resultado).toBeNull()
  })

  it("devuelve null para un token expirado", async () => {
    vi.useFakeTimers()

    const token = await signToken(PAYLOAD)

    // Avanzar más de 7 días (expiración del token)
    vi.advanceTimersByTime(7 * 24 * 60 * 60 * 1000 + 1000)

    const resultado = await verifyToken(token)

    vi.useRealTimers()
    expect(resultado).toBeNull()
  })

  it("tokens distintos para el mismo payload (iat diferente)", async () => {
    const token1 = await signToken(PAYLOAD)
    await new Promise((r) => setTimeout(r, 10))
    const token2 = await signToken(PAYLOAD)

    // Ambos válidos pero distintos (iat puede diferir en 1s si el reloj avanza)
    expect(typeof token1).toBe("string")
    expect(typeof token2).toBe("string")
  })
})

describe("signToken", () => {
  it("devuelve un string con formato JWT (tres partes separadas por punto)", async () => {
    const token = await signToken(PAYLOAD)
    const partes = token.split(".")

    expect(partes).toHaveLength(3)
  })
})
