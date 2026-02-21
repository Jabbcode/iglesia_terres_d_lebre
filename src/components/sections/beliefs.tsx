"use client"

import { useState } from "react"
import {
  BookOpen,
  Triangle,
  Users,
  Church,
  Clock,
  CalendarCheck,
  Cross,
  Flame,
  Gift,
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
import { FadeInUp } from "@/components/ui/motion"
import { useIsMobile } from "@/hooks/use-media-query"

interface Creencia {
  id: string
  icon: LucideIcon
  title: string
  subtitle?: string
  shortDescription: string
  longDescription: string
  image: string
  imageAlt: string
  mostrarDetalle: boolean
}

const creencias: Creencia[] = [
  {
    id: "biblia",
    icon: BookOpen,
    title: "La Biblia",
    shortDescription: "Palabra inspirada de Dios",
    longDescription:
      "Es la Palabra inspirada de Dios, infalible y autoritativa en todos los asuntos de fe y vida. Es nuestra guía suprema para conocer a Dios y vivir de acuerdo a su voluntad.",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Biblia abierta",
    mostrarDetalle: true,
  },
  {
    id: "trinidad",
    icon: Triangle,
    title: "Dios",
    subtitle: "Trino",
    shortDescription: "Padre, Hijo y Espíritu Santo",
    longDescription:
      "Creemos en un solo Dios, eterno, que existe en tres personas: Padre, Hijo y Espíritu Santo, creador y sustentador de todo el universo.",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Luz divina",
    mostrarDetalle: true,
  },
  {
    id: "jesucristo",
    icon: Cross,
    title: "Jesucristo",
    subtitle: "nuestro Salvador",
    shortDescription: "Plenamente Dios y hombre",
    longDescription:
      "Creemos que Jesucristo, el Hijo de Dios, es plenamente Dios y plenamente hombre. Nació de una virgen, vivió una vida sin pecado, murió en la cruz por nuestros pecados, resucitó al tercer día, ascendió al cielo y vendrá otra vez en gloria.",
    image:
      "https://images.unsplash.com/photo-1445633629932-0029acc44e88?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Cruz al atardecer",
    mostrarDetalle: true,
  },
  {
    id: "espiritu-santo",
    icon: Flame,
    title: "El Espíritu Santo",
    subtitle: "nuestro Consolador",
    shortDescription: "Mora en los creyentes",
    longDescription:
      "Creemos en el Espíritu Santo, que convence al mundo de pecado, regenera a los creyentes, mora en ellos, los sella para el día de la redención, y los capacita para vivir una vida santa y de servicio.",
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Luz y espiritualidad",
    mostrarDetalle: true,
  },
  {
    id: "salvacion",
    icon: Gift,
    title: "La Salvación",
    subtitle: "un regalo de Dios",
    shortDescription: "Por gracia mediante la fe",
    longDescription:
      "La salvación es un don de Dios, recibido por gracia mediante la fe en Jesucristo. No se basa en méritos humanos, sino en el sacrificio de Cristo. La fe genuina se manifiesta en obras de obediencia.",
    image:
      "https://images.unsplash.com/photo-1490730141103-6cac27abb37f?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Luz de esperanza",
    mostrarDetalle: true,
  },
  {
    id: "humanidad",
    icon: Users,
    title: "El Ser Humano",
    shortDescription: "Creado a imagen de Dios",
    longDescription:
      "El ser humano fue creado a imagen de Dios, pero cayó en pecado, lo que resultó en separación de Dios. Sin embargo, por medio de Cristo tenemos la oportunidad de ser reconciliados con nuestro Creador.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Comunidad de personas",
    mostrarDetalle: false,
  },
  {
    id: "iglesia",
    icon: Church,
    title: "La Iglesia",
    shortDescription: "El cuerpo de Cristo",
    longDescription:
      "El cuerpo de Cristo, la comunidad de los creyentes, llamada a adorar a Dios, edificarse mutuamente y compartir el evangelio con el mundo.",
    image:
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Iglesia reunida",
    mostrarDetalle: true,
  },
  {
    id: "futuro",
    icon: Clock,
    title: "El Futuro",
    shortDescription: "Segunda venida de Cristo",
    longDescription:
      "Creemos en la segunda venida de Cristo, la resurrección de los muertos, el juicio final y la vida eterna con Dios para todos los que creen en Él.",
    image:
      "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Cielo y estrellas",
    mostrarDetalle: false,
  },
  {
    id: "ordenanzas",
    icon: CalendarCheck,
    title: "Las Ordenanzas",
    shortDescription: "Bautismo y Santa Cena",
    longDescription:
      "Practicamos el Bautismo del creyente por inmersión y la Cena del Señor como símbolos de nuestra fe y comunión con Cristo y su iglesia.",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Bautismo",
    mostrarDetalle: true,
  },
]

export function Beliefs() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const isMobile = useIsMobile()

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
              En qué{" "}
              <span className="text-amber font-serif italic">Creemos</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              Fundamentamos nuestra fe en la <em>Palabra de Dios</em>. Creemos
              en un único Dios, creador del universo, manifestado en tres
              personas: <em>Padre, Hijo y Espíritu Santo</em>.
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
                    <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                      {creencia.longDescription}
                    </p>
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
                    <div className="bg-muted overflow-hidden rounded-2xl">
                      <img
                        src={creencia.image}
                        alt={creencia.imageAlt}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
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
