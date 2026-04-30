import { describe, it, expect } from "vitest"
import {
  locales,
  defaultLocale,
  localeNames,
  isValidLocale,
} from "@/lib/i18n/config"

describe("locales", () => {
  it("contiene exactamente es, ca y en", () => {
    expect(locales).toEqual(["es", "ca", "en"])
  })
})

describe("defaultLocale", () => {
  it("es español", () => {
    expect(defaultLocale).toBe("es")
  })
})

describe("localeNames", () => {
  it("tiene el nombre correcto para cada locale", () => {
    expect(localeNames.es).toBe("Español")
    expect(localeNames.ca).toBe("Català")
    expect(localeNames.en).toBe("English")
  })
})

describe("isValidLocale", () => {
  it.each(["es", "ca", "en"])(
    "devuelve true para el locale válido '%s'",
    (locale) => {
      expect(isValidLocale(locale)).toBe(true)
    }
  )

  it.each(["fr", "de", "pt", "EN", "ES", "", "español"])(
    "devuelve false para '%s'",
    (locale) => {
      expect(isValidLocale(locale)).toBe(false)
    }
  )
})
