"use client"

import { useState, useEffect } from "react"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Evento {
  id: string
  nombre: string
  descripcion: string | null
  fecha: string
  horaInicio: string
  horaFin: string | null
  ubicacion: string
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

export function UpcomingEvents() {
  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    fetch("/api/public/eventos")
      .then((res) => res.json())
      .then((data) => setEventos(data.slice(0, 3)))
      .catch(() => setEventos([]))
  }, [])

  if (eventos.length === 0) {
    return null
  }

  return (
    <section className="border-border border-t bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-amber mb-3 text-xs font-bold tracking-[0.3em]">
            PRÓXIMOS EVENTOS
          </p>
          <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:text-4xl">
            Únete a nuestras actividades
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Estas son algunas de las próximas actividades que hemos preparado
            para nuestra comunidad.
          </p>
        </div>

        {/* Events grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="border-border/50 bg-cream flex flex-col rounded-2xl border p-6 shadow-sm"
            >
              <div className="text-amber mb-4 flex items-center gap-2">
                <CalendarDays className="size-5" />
                <span className="text-sm font-semibold capitalize">
                  {formatDate(evento.fecha)}
                </span>
              </div>
              <h3 className="text-foreground mb-2 text-lg font-bold">
                {evento.nombre}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
                {evento.descripcion}
              </p>
              <div className="text-muted-foreground space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{evento.horaInicio}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span className="line-clamp-1">{evento.ubicacion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="border-amber text-amber hover:bg-amber h-11 rounded-full px-8 text-sm font-semibold hover:text-white"
          >
            <Link href="/horarios">Ver todos los horarios</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
