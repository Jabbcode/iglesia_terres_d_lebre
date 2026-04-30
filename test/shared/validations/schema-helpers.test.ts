import { describe, it, expect } from "vitest"
import {
  emptyToNull,
  optionalUrl,
  optionalEmail,
  optionalNullableString,
  requiredUrl,
  requiredString,
} from "@/shared/validations/schema-helpers"

describe("emptyToNull", () => {
  it("transforma string vacío en null", () => {
    expect(emptyToNull("")).toBeNull()
  })

  it("devuelve el string tal cual si no está vacío", () => {
    expect(emptyToNull("hola")).toBe("hola")
  })

  it("devuelve null si recibe null", () => {
    expect(emptyToNull(null)).toBeNull()
  })

  it("devuelve undefined si recibe undefined", () => {
    expect(emptyToNull(undefined)).toBeUndefined()
  })
})

describe("optionalUrl", () => {
  it("acepta una URL válida y la devuelve", () => {
    expect(optionalUrl.parse("https://example.com")).toBe("https://example.com")
  })

  it("transforma string vacío en null", () => {
    expect(optionalUrl.parse("")).toBeNull()
  })

  it("devuelve undefined si el campo no se proporciona", () => {
    expect(optionalUrl.parse(undefined)).toBeUndefined()
  })

  it("lanza error para una URL con formato inválido", () => {
    expect(() => optionalUrl.parse("no-es-una-url")).toThrow()
  })
})

describe("optionalEmail", () => {
  it("acepta un email válido y lo devuelve", () => {
    expect(optionalEmail.parse("admin@iglesia.es")).toBe("admin@iglesia.es")
  })

  it("transforma string vacío en null", () => {
    expect(optionalEmail.parse("")).toBeNull()
  })

  it("devuelve undefined si el campo no se proporciona", () => {
    expect(optionalEmail.parse(undefined)).toBeUndefined()
  })

  it("lanza error para un email con formato inválido", () => {
    expect(() => optionalEmail.parse("no-es-un-email")).toThrow()
  })
})

describe("optionalNullableString", () => {
  it("transforma string vacío en null", () => {
    expect(optionalNullableString.parse("")).toBeNull()
  })

  it("devuelve el string tal cual si no está vacío", () => {
    expect(optionalNullableString.parse("texto")).toBe("texto")
  })

  it("acepta null como entrada directa", () => {
    expect(optionalNullableString.parse(null)).toBeNull()
  })

  it("devuelve undefined si el campo no se proporciona", () => {
    expect(optionalNullableString.parse(undefined)).toBeUndefined()
  })
})

describe("requiredUrl", () => {
  it("acepta una URL válida", () => {
    expect(requiredUrl.parse("https://iglesiabiblicaterresdelebre.es")).toBe(
      "https://iglesiabiblicaterresdelebre.es"
    )
  })

  it("lanza error para una URL inválida", () => {
    expect(() => requiredUrl.parse("texto-plano")).toThrow()
  })

  it("lanza error para string vacío", () => {
    expect(() => requiredUrl.parse("")).toThrow()
  })
})

describe("requiredString", () => {
  it("acepta un string no vacío", () => {
    expect(requiredString().parse("valor")).toBe("valor")
  })

  it("lanza error para string vacío con el mensaje por defecto", () => {
    expect(() => requiredString().parse("")).toThrow("Campo requerido")
  })

  it("usa el nombre del campo en el mensaje de error", () => {
    expect(() => requiredString("Título").parse("")).toThrow("Título requerido")
  })
})
