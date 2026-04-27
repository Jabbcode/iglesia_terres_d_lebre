"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { locales, type Locale } from "@/lib/i18n/config"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const localeFlagCode: Record<Locale, string> = {
  es: "es",
  ca: "es-ct",
  en: "gb",
}

const localeLabels: Record<Locale, string> = {
  es: "ES",
  ca: "CA",
  en: "EN",
}

export function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const switchLocale = (locale: Locale) => {
    if (locale === currentLang) { setOpen(false); return }
    const segments = pathname.split("/")
    segments[1] = locale
    router.push(segments.join("/"))
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-amber hover:text-amber focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={`fi fi-${localeFlagCode[currentLang]} rounded-sm flex-shrink-0`}
          style={{ width: "1.25rem", height: "0.9rem" }}
        />
        <span>{localeLabels[currentLang]}</span>
        <ChevronDown
          className={cn("size-3.5 text-gray-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 w-28 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {locales.map((locale) => (
            <li key={locale} role="option" aria-selected={locale === currentLang}>
              <button
                onClick={() => switchLocale(locale)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-sm font-semibold transition-colors",
                  locale === currentLang
                    ? "bg-amber/10 text-amber"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <span
                  className={`fi fi-${localeFlagCode[locale]} rounded-sm flex-shrink-0`}
                  style={{ width: "1.25rem", height: "0.9rem" }}
                />
                {localeLabels[locale]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
