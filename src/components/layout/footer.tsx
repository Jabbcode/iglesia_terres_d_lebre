"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import { useConfigStore } from "@/stores/config-store"

const navLinks = [
  { href: "/creencias", label: "Creencias" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/horarios", label: "Horarios" },
  { href: "/galeria", label: "Galería" },
  { href: "/contacto", label: "Contacto" },
]

export function Footer() {
  const { config, fetchConfig } = useConfigStore()

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const direccion = config?.direccion?.replace("\n", ", ") || ""
  const telefono = config?.telefono || ""
  const email = config?.email || ""
  const descripcion =
    config?.descripcion ||
    "Somos una familia de fe en Terres de l'Ebre. Un lugar donde cada persona es bienvenida tal como es."
  const whatsappNumber = telefono.replace(/\s+/g, "").replace("+", "")

  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1 - Logo & Description */}
          <div className="flex flex-col items-center space-y-4 text-center sm:col-span-2 sm:items-start sm:text-left lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Logo Iglesia Bíblica Terres de l'Ebre"
                className="size-8 object-contain"
              />
              <span className="text-sm font-bold tracking-wider">
                IGLESIA BIBLICA
                <br />
                TERRES DE L&apos;EBRE
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              {descripcion}
            </p>
            <div className="flex gap-3">
              {telefono && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-amber flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors"
                >
                  <MessageCircle className="size-4" />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="hover:bg-amber flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors"
                >
                  <Mail className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2 - Navigation Links */}
          <nav
            aria-label="Enlaces del footer"
            className="text-center sm:text-left"
          >
            <h2 className="mb-4 text-xs font-bold tracking-widest text-white/40">
              ENLACES
            </h2>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 - Contact */}
          <div className="text-center sm:text-left">
            <h2 className="mb-4 text-xs font-bold tracking-widest text-white/40">
              CONTACTO
            </h2>
            <address className="space-y-3 not-italic">
              {direccion && (
                <p className="flex items-start justify-center gap-2 text-sm text-white/60 sm:justify-start">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{direccion}</span>
                </p>
              )}
              {telefono && (
                <p className="flex items-center justify-center gap-2 text-sm text-white/60 sm:justify-start">
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${telefono.replace(/\s+/g, "")}`}
                    className="hover:text-white"
                  >
                    {telefono}
                  </a>
                </p>
              )}
              {email && (
                <p className="flex items-center justify-center gap-2 text-sm text-white/60 sm:justify-start">
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-white/40 sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} Iglesia Bíblica Terres de
            l&apos;Ebre. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
