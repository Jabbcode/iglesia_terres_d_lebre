"use client"

import { useEffect, useState } from "react"
import {
  Church,
  HeartHandshake,
  Users,
  BookOpen,
  Smile,
  Calendar,
  Music,
  Mic2,
  Sun,
  Moon,
  Star,
  type LucideIcon,
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface Horario {
  id: string
  titulo: string
  subtitulo: string | null
  descripcion: string | null
  descripcionLarga: string | null
  dia: string
  hora: string
  icono: string | null
  imagen: string | null
  mostrarDetalle: boolean
}

const iconMap: Record<string, LucideIcon> = {
  Church,
  HeartHandshake,
  Users,
  BookOpen,
  Smile,
  Calendar,
  Music,
  Mic2,
  Sun,
  Moon,
  Star,
}

export function Schedule() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/public/horarios")
      .then((res) => res.json())
      .then((data) => {
        setHorarios(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const getIcon = (iconName: string | null): LucideIcon => {
    if (iconName && iconMap[iconName]) {
      return iconMap[iconName]
    }
    return Calendar
  }

  const horariosConDetalle = horarios.filter(
    (h) => h.mostrarDetalle && h.imagen
  )

  if (loading) {
    return (
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-muted mx-auto h-8 w-48 animate-pulse rounded" />
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Header */}
      <section className="bg-cream pt-20 pb-6">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Nuestros{" "}
            <span className="text-amber font-serif italic">Horarios</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Únete a nuestra comunidad. Un espacio para{" "}
            <em className="text-amber not-italic">crecer en la fe</em>,
            compartir en <em className="text-amber not-italic">comunión</em> y
            adorar juntos.
          </p>
        </div>
      </section>

      {/* Schedule cards */}
      <section className="bg-cream pt-10 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {horarios.length <= 4 ? (
            <div className="flex flex-wrap justify-center gap-5">
              {horarios.map((horario) => {
                const Icon = getIcon(horario.icono)
                return (
                  <div
                    key={horario.id}
                    className="border-border/50 w-full max-w-[280px] rounded-2xl border bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center">
                      <Icon className="text-amber size-9" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-foreground mb-1 text-lg font-bold">
                      {horario.titulo}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {horario.dia}, {horario.hora}
                    </p>
                  </div>
                )
              })}
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
                {horarios.map((horario) => {
                  const Icon = getIcon(horario.icono)
                  return (
                    <CarouselItem
                      key={horario.id}
                      className="-full pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <div className="border-border/50 rounded-2xl border bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center">
                          <Icon
                            className="text-amber size-9"
                            strokeWidth={1.5}
                          />
                        </div>
                        <h3 className="text-foreground mb-1 text-lg font-bold">
                          {horario.titulo}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {horario.dia}, {horario.hora}
                        </p>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="left-0 -translate-x-1/2" />
              <CarouselNext className="right-0 translate-x-1/2" />
            </Carousel>
          )}
        </div>
      </section>

      {/* Detail sections (alternating) */}
      {horariosConDetalle.length > 0 && (
        <section className="bg-white">
          {horariosConDetalle.map((horario, index) => {
            const isReversed = index % 2 !== 0
            const Icon = getIcon(horario.icono)
            return (
              <div
                key={horario.id}
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
              >
                <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
                  {/* Text */}
                  <div
                    className={`flex-1 ${isReversed ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <h2 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
                      {horario.titulo}{" "}
                      {horario.subtitulo && (
                        <span className="text-amber font-serif italic">
                          {horario.subtitulo}
                        </span>
                      )}
                    </h2>
                    <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                      {horario.descripcionLarga || horario.descripcion}
                    </p>
                    <div className="flex items-center gap-3">
                      <Icon className="text-amber size-5" strokeWidth={1.5} />
                      <span className="text-foreground text-sm font-semibold">
                        {horario.dia} a las {horario.hora}
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  {horario.imagen && (
                    <div
                      className={`w-full max-w-sm lg:max-w-md ${isReversed ? "lg:order-1" : "lg:order-2"}`}
                    >
                      <div className="bg-muted overflow-hidden rounded-2xl">
                        <img
                          src={horario.imagen}
                          alt={horario.titulo}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </section>
      )}
    </>
  )
}
