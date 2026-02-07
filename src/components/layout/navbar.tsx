"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Church } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "INICIO" },
  { href: "/creencias", label: "CREENCIAS" }, // Nosotros?
  { href: "/horarios", label: "HORARIOS" },
  { href: "/galeria", label: "GALERÍA" },
  { href: "/contacto", label: "CONTACTO" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Church className="size-7 text-amber" />
          <span className="text-sm font-bold tracking-wider text-foreground">
            IGLESIA BIBLICA TERRES DE L'EBRE
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold tracking-wider text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        {/* <Button
          asChild
          className="hidden rounded-full bg-amber px-6 text-xs font-bold tracking-wider text-white hover:bg-amber-dark md:inline-flex"
        >
          <Link href="#nuevos">NUEVOS AQUÍ</Link>
        </Button> */}

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
                <Church className="size-6 text-amber" />
                <span className="text-sm font-bold tracking-wider">
                  IGLESIA BIBLICA
                  <br />
                  TERRES DE L'EBRE
                </span>
              </Link>
              <nav className="flex flex-col gap-4 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold tracking-wider text-foreground/70 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {/* <div className="px-4">
                <Button
                  asChild
                  className="w-full rounded-full bg-amber text-xs font-bold tracking-wider text-white hover:bg-amber-dark"
                >
                  <Link href="#nuevos" onClick={() => setOpen(false)}>
                    NUEVOS AQUÍ
                  </Link>
                </Button>
              </div> */}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
