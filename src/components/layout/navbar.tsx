"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { useConfigStore } from "@/stores/config-store"
import { cn } from "@/lib/utils"
import { api } from "@/shared/api"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import type { Locale } from "@/lib/i18n/config"

interface NavbarProps {
  lang: Locale
}

export function Navbar({ lang }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { config } = useConfigStore()
  const pathname = usePathname()

  const navLinks = [
    {
      href: `/${lang}`,
      label: lang === "es" ? "INICIO" : lang === "ca" ? "INICI" : "HOME",
    },
    {
      href: `/${lang}/creencias`,
      label:
        lang === "es" ? "CREENCIAS" : lang === "ca" ? "CREENCES" : "BELIEFS",
    },
    {
      href: `/${lang}/nosotros`,
      label:
        lang === "es" ? "NOSOTROS" : lang === "ca" ? "NOSALTRES" : "ABOUT US",
    },
    {
      href: `/${lang}/horarios`,
      label:
        lang === "es" ? "HORARIOS" : lang === "ca" ? "HORARIS" : "SCHEDULE",
    },
    {
      href: `/${lang}/galeria`,
      label: lang === "es" ? "GALERÍA" : lang === "ca" ? "GALERIA" : "GALLERY",
    },
    {
      href: `/${lang}/contacto`,
      label:
        lang === "es" ? "CONTACTO" : lang === "ca" ? "CONTACTE" : "CONTACT",
    },
  ]

  const isActive = (href: string) => {
    if (href === `/${lang}`)
      return pathname === `/${lang}` || pathname === `/${lang}/`
    return pathname.startsWith(href)
  }

  useEffect(() => {
    api
      .get<{ user: unknown }>("/api/auth/me")
      .then((data) => setIsAdmin(!!data.user))
      .catch(() => setIsAdmin(false))
  }, [])

  return (
    <header className="border-border/40 sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <img
            src="/logo_black.png"
            alt="Logo Iglesia Bíblica Terres de l'Ebre"
            className="size-28 object-contain"
          />
          <span className="relative right-7">
            <div className="flex flex-col">
              <span className="text-muted-foreground relative top-1 left-0.5 text-xs md:text-sm">
                Iglesia Biblica
              </span>
              <span className="relative top-0.5 text-sm md:text-lg">
                {config?.nombreIglesia}
              </span>
            </div>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-semibold tracking-wider transition-colors",
                isActive(link.href)
                  ? "text-amber"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher currentLang={lang} />
          {isAdmin && (
            <Link
              href="/admin"
              className="bg-amber hover:bg-amber-dark flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-colors"
            >
              <Settings className="size-3.5" />
              ADMIN
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <div className="flex flex-col gap-6 pt-8">
              <Link href={`/${lang}`} className="flex items-center gap-2 px-4">
                <img
                  src="/logo_black.png"
                  alt="Logo Iglesia Bíblica Terres de l'Ebre"
                  className="size-28 object-contain"
                />
                <span className="relative right-7">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground relative top-1 left-0.5 text-xs">
                      Iglesia Biblica
                    </span>
                    <span className="text-sm relative">
                      {config?.nombreIglesia}
                    </span>
                  </div>
                </span>
              </Link>
              <div className="px-4">
                <LanguageSwitcher currentLang={lang} />
              </div>
              <nav className="flex flex-col gap-4 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-sm font-semibold tracking-wider transition-colors",
                      isActive(link.href)
                        ? "text-amber"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="text-amber hover:text-amber-dark flex items-center gap-2 text-sm font-semibold tracking-wider transition-colors"
                  >
                    <Settings className="size-4" />
                    ADMIN
                  </Link>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
