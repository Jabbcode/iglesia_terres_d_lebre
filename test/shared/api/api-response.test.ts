import { describe, it, expect, vi, afterEach } from "vitest"
import { z, ZodError } from "zod"
import {
  success,
  publicSuccess,
  created,
  noContent,
  validationError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  handleError,
} from "@/shared/api/api-response"

afterEach(() => {
  vi.restoreAllMocks()
})

function zodError(): ZodError {
  const result = z
    .object({ nombre: z.string().min(1, "Nombre requerido") })
    .safeParse({
      nombre: "",
    })
  if (!result.success) return result.error
  throw new Error("Se esperaba un ZodError")
}

describe("success", () => {
  it("devuelve status 200 con los datos", async () => {
    const response = success({ ok: true })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
  })

  it("acepta un status personalizado", async () => {
    const response = success({ ok: true }, 202)

    expect(response.status).toBe(202)
  })
})

describe("publicSuccess", () => {
  it("devuelve status 200 con los datos", async () => {
    const response = publicSuccess({ items: [] })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ items: [] })
  })

  it("incluye el header Cache-Control para CDN", () => {
    const response = publicSuccess({})

    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=86400, stale-while-revalidate=3600"
    )
  })
})

describe("created", () => {
  it("devuelve status 201 con los datos", async () => {
    const response = created({ id: "abc" })

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ id: "abc" })
  })
})

describe("noContent", () => {
  it("devuelve status 204 sin cuerpo", () => {
    const response = noContent()

    expect(response.status).toBe(204)
  })
})

describe("validationError", () => {
  it("devuelve status 400 con mensaje 'Datos inválidos'", async () => {
    const response = validationError(zodError())
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe("Datos inválidos")
  })

  it("incluye los detalles de los campos inválidos", async () => {
    const response = validationError(zodError())
    const body = await response.json()

    expect(Array.isArray(body.details)).toBe(true)
    expect(body.details[0]).toMatchObject({
      field: "nombre",
      message: expect.any(String),
    })
  })
})

describe("badRequest", () => {
  it("devuelve status 400 con el mensaje indicado", async () => {
    const response = badRequest("Parámetro inválido")
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe("Parámetro inválido")
  })
})

describe("unauthorized", () => {
  it("devuelve status 401 con el mensaje por defecto", async () => {
    const response = unauthorized()
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe("No autorizado")
  })

  it("acepta un mensaje personalizado", async () => {
    const response = unauthorized("Token expirado")

    expect((await response.json()).error).toBe("Token expirado")
  })
})

describe("forbidden", () => {
  it("devuelve status 403 con el mensaje por defecto", async () => {
    const response = forbidden()

    expect(response.status).toBe(403)
    expect((await response.json()).error).toBe("Acceso denegado")
  })
})

describe("notFound", () => {
  it("devuelve status 404 con el mensaje por defecto", async () => {
    const response = notFound()

    expect(response.status).toBe(404)
    expect((await response.json()).error).toBe("Recurso no encontrado")
  })
})

describe("serverError", () => {
  it("devuelve status 500 con el mensaje por defecto", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const response = serverError(new Error("fallo"))

    expect(response.status).toBe(500)
    expect((await response.json()).error).toBe("Error interno del servidor")
  })
})

describe("handleError", () => {
  it("devuelve 400 para un ZodError", () => {
    const response = handleError(zodError())

    expect(response.status).toBe(400)
  })

  it("devuelve 404 para un error de Prisma P2025 (registro no encontrado)", () => {
    const prismaNotFound = { code: "P2025", message: "Record not found" }
    const response = handleError(prismaNotFound)

    expect(response.status).toBe(404)
  })

  it("devuelve 500 para cualquier otro error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const response = handleError(new Error("inesperado"))

    expect(response.status).toBe(500)
  })
})
