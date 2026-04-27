"use client"

import { usePathname, useRouter } from "next/navigation"
import { locales, type Locale } from "@/lib/i18n/config"

const localeFlags: Record<Locale, string> = {
  es: "🇪🇸",
  ca: "🏴󠁥󠁳󠁣󠁴󠁿",
  en: "🇬🇧",
}

const localeLabels: Record<Locale, string> = {
  es: "ES",
  ca: "CA",
  en: "EN",
}

export function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale
    if (newLocale === currentLang) return
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
  }

  return (
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-2 text-base leading-none">
        {localeFlags[currentLang]}
      </span>
      <select
        value={currentLang}
        onChange={handleChange}
        className="h-9 appearance-none rounded-full border border-gray-200 bg-white pl-8 pr-6 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30 cursor-pointer"
        aria-label="Seleccionar idioma"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeFlags[locale]} {localeLabels[locale]}
          </option>
        ))}
      </select>
      {/* chevron */}
      <span className="pointer-events-none absolute right-2 text-gray-400 text-xs">
        ▾
      </span>
    </div>
  )
}
