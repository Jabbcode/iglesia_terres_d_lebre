"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Newsletter() {
  return (
    <section className="border-border border-t bg-white py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-amber mb-3 text-xs font-bold tracking-[0.3em]">
          NUESTRA COMUNIDAD
        </p>
        <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:text-4xl">
          Mantente al día con nuestros eventos semanales
        </h2>
        <p className="text-muted-foreground mb-8 text-base leading-relaxed">
          Suscríbete a nuestro boletín para recibir notas de prédicas y
          novedades de la comunidad directamente en tu bandeja de entrada.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto flex max-w-md flex-col items-center gap-3 sm:flex-row"
        >
          <Input
            type="email"
            placeholder="Tu correo electrónico"
            required
            className="border-border h-11 bg-white"
          />
          <Button className="bg-amber hover:bg-amber-dark h-11 shrink-0 rounded-md px-8 text-sm font-bold text-white">
            Suscribirme
          </Button>
        </form>
      </div>
    </section>
  )
}
