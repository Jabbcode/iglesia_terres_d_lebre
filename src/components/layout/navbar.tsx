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

const navLinks = [
  { href: "/", label: "INICIO" },
  { href: "/creencias", label: "CREENCIAS" },
  { href: "/nosotros", label: "NOSOTROS" },
  { href: "/horarios", label: "HORARIOS" },
  { href: "/galeria", label: "GALERÍA" },
  { href: "/contacto", label: "CONTACTO" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { config } = useConfigStore()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAdmin(!!data.user)
      })
      .catch(() => setIsAdmin(false))
  }, [])

  return (
    <header className="border-border/40 sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo_black.png"
            alt="Logo Iglesia Bíblica Terres de l'Ebre"
            className="size-28 object-contain"
          />
          <span className="relative right-7">
            <div className="flex flex-col">
              <span className="text-muted-foreground relative top-1 left-0.5 text-sm">
                Iglesia Biblica
              </span>
              <span className="relative top-0.5 text-lg">
                {config?.nombreIglesia}
              </span>
            </div>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
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
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <div className="flex flex-col gap-6 pt-8">
              <Link href="/" className="flex items-center gap-2 px-4">
                <img
                  src="/logo_black.png"
                  alt="Logo Iglesia Bíblica Terres de l'Ebre"
                  className="size-28 object-contain"
                />
                <span className="relative right-7">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground relative top-1 left-0.5 text-sm">
                      Iglesia Biblica
                    </span>
                    <span className="text-md text-md relative">
                      {config?.nombreIglesia}
                    </span>
                  </div>
                </span>
              </Link>
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
