"use client"

import { useEffect, useState } from "react"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { FadeInUp } from "@/components/ui/motion"
import { useIsMobile } from "@/hooks/use-media-query"

interface Evento {
  id: string
  nombre: string
  descripcion: string | null
  fecha: string
  horaInicio: string
  horaFin: string | null
  ubicacion: string | null
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
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    fetch("/api/public/eventos")
      .then((res) => res.json())
      .then((data) => {
        setEventos(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="border-border border-t bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="bg-muted mx-auto h-4 w-32 animate-pulse rounded" />
          </div>
        </div>
      </section>
    )
  }

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

        {/* Events - En móvil: slider si hay más de 1. En desktop: slider si hay más de 3 */}
        {(isMobile ? eventos.length <= 1 : eventos.length <= 3) ? (
          <div className="flex flex-wrap justify-center gap-6">
            {eventos.map((evento, index) => (
              <FadeInUp key={evento.id} delay={index * 0.1}>
                <div className="border-border/50 bg-cream flex h-full w-full max-w-sm flex-col rounded-2xl border p-6 shadow-sm">
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
                  {evento.ubicacion && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      <span className="line-clamp-1">{evento.ubicacion}</span>
                    </div>
                  )}
                </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {eventos.map((evento) => (
                <CarouselItem
                  key={evento.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="border-border/50 bg-cream flex h-full flex-col rounded-2xl border p-6 shadow-sm">
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
                      {evento.ubicacion && (
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4" />
                          <span className="line-clamp-1">{evento.ubicacion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 -translate-x-1/2" />
            <CarouselNext className="right-0 translate-x-1/2" />
          </Carousel>
        )}

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
