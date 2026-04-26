"use client"

import { useEffect, useState } from "react"
import { CalendarDays, MapPin, Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeInUp } from "@/components/ui/motion"
import Link from "next/link"
import type { Evento } from "@/modules/eventos"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useIsMobile } from "@/hooks/use-media-query"
import { api } from "@/shared/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/dictionaries"

function NoEventsIllustration() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-amber"
    >
      {/* Calendar base */}
      <rect
        x="25"
        y="35"
        width="90"
        height="80"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.2"
      />
      <rect
        x="30"
        y="30"
        width="80"
        height="75"
        rx="6"
        fill="currentColor"
        opacity="0.08"
      />
      <rect
        x="30"
        y="25"
        width="80"
        height="75"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M30 50 L110 50" stroke="currentColor" strokeWidth="2" />

      {/* Calendar pins */}
      <rect x="45" y="15" width="4" height="20" rx="2" fill="currentColor" />
      <rect x="91" y="15" width="4" height="20" rx="2" fill="currentColor" />

      {/* Empty calendar dots */}
      <circle cx="50" cy="65" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="70" cy="65" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="90" cy="65" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="50" cy="82" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="70" cy="82" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="90" cy="82" r="3" fill="currentColor" opacity="0.2" />

      {/* Peaceful elements */}
      <circle cx="115" cy="45" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="25" cy="60" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="120" cy="75" r="2" fill="currentColor" opacity="0.3" />

      {/* Subtle church cross */}
      <path
        d="M70 108 L70 125"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M63 115 L77 115"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

const localeMap: Record<string, string> = {
  es: "es-ES",
  ca: "ca-ES",
  en: "en-US",
}

function formatDate(dateStr: string | Date, lang: string): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
  return date.toLocaleDateString(localeMap[lang] ?? "es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

interface EventCardProps {
  evento: Evento
  lang: string
  dict: Dictionary
}

function EventCard({ evento, lang, dict }: EventCardProps) {
  const [showDescription, setShowDescription] = useState(false)

  return (
    <div className="border-border/50 group w-full max-w-sm overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image with overlay */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={
            evento.imagen ||
            `https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop`
          }
          alt={evento.nombre}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay with description - controlled by button */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300 ${
            showDescription ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-center text-sm leading-relaxed text-white">
            {evento.descripcion}
          </p>
        </div>
      </div>
      {/* Content */}
      <div className="p-5">
        <div className="text-amber mb-3 flex items-center gap-2">
          <CalendarDays className="size-4" />
          <span className="text-xs font-semibold uppercase">
            {formatDate(evento.fecha, lang)}
          </span>
        </div>
        <h3 className="text-foreground mb-4 text-lg font-bold">
          {evento.nombre}
        </h3>
        <div className="text-muted-foreground space-y-2 text-sm">
          {/* Hora con botón alineado a la derecha */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>{evento.horaInicio}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-amber hover:bg-amber/10 hover:text-amber h-auto px-2 py-1 text-xs"
              onClick={() => setShowDescription(!showDescription)}
            >
              <Info className="mr-1 size-3" />
              {showDescription
                ? dict.home.upcomingEvents.hide
                : dict.home.upcomingEvents.learnMore}
            </Button>
          </div>
          {/* Ubicación */}
          {evento.ubicacion && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span className="line-clamp-1">{evento.ubicacion}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface UpcomingEventsProps {
  lang: Locale
  dict: Dictionary
}

export function UpcomingEvents({ lang, dict }: UpcomingEventsProps) {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    api
      .get<Evento[]>(`/api/public/eventos?lang=${lang}`)
      .then(setEventos)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [lang])

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
    return (
      <section className="border-border border-t bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <NoEventsIllustration />
              <h2 className="text-foreground mt-6 text-2xl font-bold sm:text-3xl">
                {dict.home.upcomingEvents.noEvents}
              </h2>
              <p className="text-muted-foreground mt-3 max-w-md text-base leading-relaxed">
                {dict.home.upcomingEvents.noEventsDescription}
              </p>
              <Button
                asChild
                className="bg-amber hover:bg-amber-dark mt-6 h-11 rounded-full px-8 text-sm font-semibold"
              >
                <Link href={`/${lang}/horarios`}>
                  {dict.home.upcomingEvents.viewSchedules}
                </Link>
              </Button>
            </div>
          </FadeInUp>
        </div>
      </section>
    )
  }

  return (
    <section className="border-border border-t bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-amber mb-3 text-xs font-bold tracking-[0.3em]">
            {dict.home.upcomingEvents.badge}
          </p>
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
            {dict.home.upcomingEvents.title}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            {dict.home.upcomingEvents.description}
          </p>
        </div>

        {/* Events - En móvil: slider si hay más de 1. En desktop: slider si hay más de 3 */}
        {(isMobile ? eventos.length <= 1 : eventos.length <= 3) ? (
          <div className="flex flex-wrap justify-center gap-6">
            {eventos.map((evento, index) => (
              <FadeInUp key={evento.id} delay={index * 0.1}>
                <EventCard evento={evento} lang={lang} dict={dict} />
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
            {/* Contenedor con espacio para flechas en desktop */}
            <div className="relative md:px-12">
              <CarouselContent className="-ml-4">
                {eventos.map((evento) => (
                  <CarouselItem
                    key={evento.id}
                    className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
                  >
                    <EventCard evento={evento} lang={lang} dict={dict} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Flechas a los lados en desktop */}
              <CarouselPrevious className="absolute top-1/2 -left-1 hidden -translate-y-1/2 md:flex" />
              <CarouselNext className="absolute top-1/2 -right-1 hidden -translate-y-1/2 md:flex" />
            </div>
            {/* Flechas centradas en móvil */}
            <div className="mt-6 flex justify-center gap-4 md:hidden">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button
            asChild
            className="bg-amber hover:bg-amber-dark mt-6 h-11 rounded-full px-8 text-sm font-semibold"
          >
            <Link href={`/${lang}/horarios`}>
              {dict.home.upcomingEvents.viewAllSchedules}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
