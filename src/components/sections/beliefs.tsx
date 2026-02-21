"use client"

import {
  BookOpen,
  Triangle,
  Users,
  Church,
  Clock,
  CalendarCheck,
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

const topCards = [
  {
    icon: BookOpen,
    title: "La Biblia",
    description:
      "Es la Palabra inspirada de Dios, infalible y autoritativa en todos los asuntos de fe y vida.",
  },
  {
    icon: Triangle,
    title: "Dios Trino",
    description:
      "Creemos en un solo Dios, eterno, que existe en tres personas: Padre, Hijo y Espíritu Santo, creador y sustentador de todo.",
  },
  {
    icon: Users,
    title: "El Ser Humano y el Pecado",
    description:
      "El ser humano fue creado a imagen de Dios, pero cayó en pecado, lo que resultó en separación de Dios.",
  },
]

const alternatingBeliefs = [
  {
    title: "Jesucristo,",
    subtitle: "nuestro Salvador",
    description:
      "Creemos que Jesucristo, el Hijo de Dios, es plenamente Dios y plenamente hombre. Nació de una virgen, vivió una vida sin pecado, murió en la cruz por nuestros pecados, resucitó al tercer día, ascendió al cielo y vendrá otra vez en gloria.",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Biblia abierta con cruz",
  },
  {
    title: "El Espíritu Santo,",
    subtitle: "nuestro Consolador",
    description:
      "Creemos en el Espíritu Santo, que convence al mundo de pecado, regenera a los creyentes, mora en ellos, los sella para el día de la redención, y los capacita para vivir una vida santa y de servicio.",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Luz y espiritualidad",
  },
  {
    title: "La Salvación,",
    subtitle: "un regalo de Dios",
    description:
      "La salvación es un don de Dios, recibido por gracia mediante la fe en Jesucristo. No se basa en méritos humanos, sino en el sacrificio de Cristo. La fe genuina se manifiesta en obras de obediencia.",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2940&auto=format&fit=crop",
    imageAlt: "Luz de esperanza",
  },
]

const bottomCards = [
  {
    icon: Church,
    title: "La Iglesia",
    description:
      "El cuerpo de Cristo, la comunidad de los creyentes, llamada a adorar a Dios, edificarse mutuamente y compartir el evangelio.",
  },
  {
    icon: Clock,
    title: "El Futuro",
    description:
      "Creemos en la segunda venida de Cristo, la resurrección de los muertos, el juicio final y la vida eterna con Dios.",
  },
  {
    icon: CalendarCheck,
    title: "Las Ordenanzas",
    description:
      "Practicamos el Bautismo del creyente por inmersión y la Cena del Señor como símbolos de nuestra fe y comunión.",
  },
]

function IconCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="bg-cream flex h-full flex-col items-center rounded-2xl border p-8 text-center shadow-sm">
      <div className="bg-amber/10 mb-5 flex size-16 shrink-0 items-center justify-center rounded-full">
        <Icon className="text-amber size-7" />
      </div>
      <h3 className="text-foreground mb-3 font-serif text-lg font-bold italic">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

const allCards = [...topCards, ...bottomCards]

export function Beliefs() {
  return (
    <>
      {/* Hero header */}
      <section className="bg-cream pt-20 pb-16">
        <FadeInUp>
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-foreground mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              En que{" "}
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

      {/* Cards slider */}
      <section className="border-t bg-white py-16">
        <FadeInUp>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  {allCards.map((card, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
                    >
                      <IconCard {...card} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* Flechas a los lados en desktop */}
                <CarouselPrevious className="absolute -left-1 top-1/2 hidden -translate-y-1/2 md:flex" />
                <CarouselNext className="absolute -right-1 top-1/2 hidden -translate-y-1/2 md:flex" />
              </div>
              {/* Flechas centradas en móvil */}
              <div className="mt-6 flex justify-center gap-4 md:hidden">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          </div>
        </FadeInUp>
      </section>

      {/* Alternating belief sections */}
      <section className="bg-cream border-t">
        {alternatingBeliefs.map((belief, index) => {
          const isReversed = index % 2 !== 0
          return (
            <FadeInUp key={belief.title}>
              <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <div
                  className={`flex flex-col items-center gap-8 lg:gap-12 ${
                    isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                  }`}
                >
                  {/* Text */}
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-foreground mb-3 text-xl font-bold sm:text-2xl">
                      {belief.title}{" "}
                      <span className="text-amber font-serif italic">
                        {belief.subtitle}
                      </span>
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                      {belief.description}
                    </p>
                  </div>

                  {/* Image */}
                  <div className="flex-1">
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={belief.image}
                        alt={belief.imageAlt}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FadeInUp>
          )
        })}
      </section>
    </>
  )
}
