import type { Locale } from "@/lib/i18n/config"
import es from "./es.json"
import ca from "./ca.json"
import en from "./en.json"

const dictionaries = {
  es,
  ca,
  en,
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]
}

export type Dictionary = typeof es
