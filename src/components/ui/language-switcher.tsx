"use client"

import { usePathname, useRouter } from "next/navigation"
import { locales, localeNames, type Locale } from "@/lib/i18n/config"
import { Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLang) return

    // Replace the locale prefix in the current pathname
    const segments = pathname.split("/")
    segments[1] = newLocale
    const newPath = segments.join("/")

    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
      <Globe className="ml-2 h-4 w-4 text-gray-500" />
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-all",
            locale === currentLang
              ? "bg-amber text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          )}
          aria-label={`Switch to ${localeNames[locale]}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
