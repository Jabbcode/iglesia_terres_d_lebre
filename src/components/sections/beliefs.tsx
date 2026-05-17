"use client"

import Image from "next/image"
import { useState } from "react"
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
import { creenciasBase, type Creencia } from "./beliefs.data"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/dictionaries"

interface BeliefsProps {
  lang: Locale
  dict: Dictionary
}

export function Beliefs({ lang: _lang, dict }: BeliefsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const isMobile = useIsMobile()

  // Mapear creencias desde el diccionario
  const creencias: Creencia[] = creenciasBase.map((c) => {
    // Convertir IDs con guiones a camelCase para mapeo
    const idMap: Record<string, string> = {
      biblia: "biblia",
      trinidad: "trinidad",
      jesucristo: "jesucristo",
      "espiritu-santo": "espirituSanto",
      salvacion: "salvacion",
      humanidad: "humanidad",
      "regreso-cristo": "regresoCristo",
      resurreccion: "resurreccion",
      iglesia: "iglesia",
      "bautismo-santa-cena": "bautismoSantaCena",
      matrimonio: "matrimonio",
      "estilo-vida-cristiana": "estiloVidaCristiana",
    }
    const beliefKey = idMap[c.id] as keyof typeof dict.beliefs.items
    const belief = dict.beliefs.items[beliefKey] || {}
    return {
      ...c,
      title: belief.title || c.title,
      subtitle: belief.subtitle || c.subtitle,
      shortDescription: belief.shortDescription || c.shortDescription,
      longDescription: belief.longDescription || c.longDescription,
      imageAlt: belief.imageAlt || c.imageAlt,
    }
  })

  const creenciasConDetalle = creencias.filter((c) => c.mostrarDetalle)

  const handleCardClick = (id: string) => {
    const creencia = creencias.find((c) => c.id === id)
    if (creencia?.mostrarDetalle) {
      setSelectedId(id)
      // Scroll to detail section
      const element = document.getElementById(`creencia-${id}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  return (
    <>
      {/* Header */}
      <section className="bg-cream pt-20 pb-6">
        <FadeInUp>
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              {dict.beliefs.pageTitle}{" "}
              <span className="text-amber font-serif italic">
                {dict.beliefs.pageTitleEmphasis}
              </span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              {dict.beliefs.pageDescription}
            </p>
          </div>
        </FadeInUp>
      </section>

      {/* Belief cards */}
      <section className="bg-cream pt-10 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {(isMobile ? creencias.length <= 1 : creencias.length <= 4) ? (
            <div className="flex flex-wrap justify-center gap-5">
              {creencias.map((creencia) => {
                const Icon = creencia.icon
                return (
                  <button
                    key={creencia.id}
                    onClick={() => handleCardClick(creencia.id)}
                    className={`border-border/50 w-full max-w-[280px] rounded-2xl border bg-white p-8 text-center shadow-sm transition-all hover:shadow-md ${
                      creencia.mostrarDetalle
                        ? "cursor-pointer hover:-translate-y-1"
                        : "cursor-default"
                    } ${
                      selectedId === creencia.id
                        ? "ring-amber ring-2 ring-offset-2"
                        : ""
                    }`}
                  >
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center">
                      <Icon className="text-amber size-9" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-foreground mb-1 text-lg font-bold">
                      {creencia.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {creencia.shortDescription}
                    </p>
                  </button>
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
              <div className="relative md:px-12">
                <CarouselContent className="mx-2 -ml-2">
                  {creencias.map((creencia) => {
                    const Icon = creencia.icon
                    return (
                      <CarouselItem
                        key={creencia.id}
                        className="basis-full py-4 pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                      >
                        <button
                          onClick={() => handleCardClick(creencia.id)}
                          className={`border-border/50 w-full rounded-2xl border bg-white p-8 text-center shadow-sm transition-all hover:shadow-md ${
                            creencia.mostrarDetalle
                              ? "cursor-pointer hover:-translate-y-1"
                              : "cursor-default"
                          } ${
                            selectedId === creencia.id
                              ? "ring-amber ring-2 ring-offset-2"
                              : ""
                          }`}
                        >
                          <div className="mx-auto mb-4 flex size-14 items-center justify-center">
                            <Icon
                              className="text-amber size-9"
                              strokeWidth={1.5}
                            />
                          </div>
                          <h3 className="text-foreground mb-1 text-lg font-bold">
                            {creencia.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {creencia.shortDescription}
                          </p>
                        </button>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 -left-1 hidden -translate-y-1/2 md:flex" />
                <CarouselNext className="absolute top-1/2 -right-1 hidden -translate-y-1/2 md:flex" />
              </div>
              <div className="mt-6 flex justify-center gap-4 md:hidden">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          )}
        </div>
      </section>

      {/* Detail sections (alternating layout like horarios) */}
      {creenciasConDetalle.length > 0 && (
        <section className="bg-white">
          {creenciasConDetalle.map((creencia, index) => {
            const isReversed = index % 2 !== 0
            const Icon = creencia.icon
            return (
              <div
                key={creencia.id}
                id={`creencia-${creencia.id}`}
                className={`mx-auto max-w-7xl px-4 py-8 transition-all duration-300 sm:py-8 lg:px-8 lg:py-12`}
              >
                <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
                  {/* Text */}
                  <div
                    className={`flex-1 ${isReversed ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <h2 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
                      {creencia.title}{" "}
                      {creencia.subtitle && (
                        <span className="text-amber font-serif italic">
                          {creencia.subtitle}
                        </span>
                      )}
                    </h2>
                    <p
                      className="text-muted-foreground mb-6 text-base leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: creencia.longDescription,
                      }}
                    />
                    <div className="flex items-center gap-3">
                      <Icon className="text-amber size-5" strokeWidth={1.5} />
                      <span className="text-foreground text-sm font-semibold">
                        {creencia.shortDescription}
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  <div
                    className={`w-full max-w-sm lg:max-w-md ${isReversed ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image
                        src={creencia.image}
                        alt={creencia.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 448px"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      )}
    </>
  )
}
